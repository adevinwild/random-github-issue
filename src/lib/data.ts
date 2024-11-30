'use server'
import 'server-only'

import { cache } from 'react'

const GITHUB_API_URL = 'https://api.github.com'

type GitHubIssue = {
  title: string
  html_url: string
  body?: string
  number?: number
  user: {
    login: string
    avatar_url: string
  }
}

import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
})

function getSecondsUntilMidnight(): number {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  return Math.floor((tomorrow.getTime() - now.getTime()) / 1000)
}

type MinimalGitHubIssue = {
  title: string
  html_url: string
  body?: string
  number: number
  user: {
    login: string
    avatar_url: string
  }
}

export const getRandomGitHubIssue = cache(async (repo: string): Promise<{ issue: MinimalGitHubIssue, expiresAt: number } | null> => {
  if (!repo) {
    throw new Error('Repository is required')
  }

  const cachedIssue = await redis.get(`gh:${repo}`) as MinimalGitHubIssue | null
  const expiresAt = await redis.ttl(`gh:${repo}`)
  if (cachedIssue) {
    await trackSearchedIssue(repo, cachedIssue)
    return {
      issue: cachedIssue,
      expiresAt
    }
  }

  try {
    const response = await fetch(`${GITHUB_API_URL}/repos/${repo}/issues?state=open`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${process.env.GITHUB_TOKEN}`
      },
      next: { revalidate: 86400 }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch issues')
    }

    const issues: GitHubIssue[] = await response.json()

    if (issues.length === 0) {
      return null
    }

    const fullIssue = issues[Math.floor(Math.random() * issues.length)]

    // Only store the fields we need
    const minimalIssue: MinimalGitHubIssue = {
      title: fullIssue.title,
      html_url: fullIssue.html_url,
      body: fullIssue.body,
      number: fullIssue.number!,
      user: {
        login: fullIssue.user.login,
        avatar_url: fullIssue.user.avatar_url
      }
    }

    const ttl = getSecondsUntilMidnight()
    await redis.set(`gh:${repo}`, JSON.stringify(minimalIssue), { ex: ttl })

    await trackSearchedIssue(repo, minimalIssue)

    return {
      issue: minimalIssue,
      expiresAt: ttl
    }
  } catch (error) {
    console.error('Error fetching GitHub issue:', error)
    throw error
  }
})

const TRENDING_ISSUES_KEY = 'gh:trending_issues'
const MAX_TRENDING_ISSUES = 10

type RepoMetadata = {
  stargazers_count: number
  description: string
  owner: {
    avatar_url: string
  }
  language: string
  topics: string[]
  contributors_count?: number
}

type TrendingIssue = {
  repo: string
  title: string
  html_url: string
  searchCount: number
  lastSearched: number
  repoMetadata?: {
    stars: number
    description: string
    ownerAvatar: string
    language: string
    topics: string[]
    contributors: number
  }
}

async function trackSearchedIssue(repo: string, issue: MinimalGitHubIssue) {
  const now = Date.now()
  const [owner, repoName] = repo.split('/')

  // Fetch both repository data and contributors in parallel
  const [repoResponse, contributorsResponse] = await Promise.all([
    fetch(`${GITHUB_API_URL}/repos/${owner}/${repoName}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${process.env.GITHUB_TOKEN}`
      }
    }),
    fetch(`${GITHUB_API_URL}/repos/${owner}/${repoName}/contributors?per_page=1`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${process.env.GITHUB_TOKEN}`
      }
    })
  ]);

  const repoData: RepoMetadata = await repoResponse.json()

  // Get contributor count from the Link header
  const linkHeader = contributorsResponse.headers.get('Link') || ''
  const match = linkHeader.match(/&page=(\d+)>; rel="last"/)
  const contributorsCount = match ? parseInt(match[1]) : 1

  const trendingIssue: TrendingIssue = {
    repo,
    title: issue.title,
    html_url: issue.html_url,
    searchCount: 1,
    lastSearched: now,
    repoMetadata: {
      stars: repoData.stargazers_count,
      description: repoData.description,
      ownerAvatar: repoData.owner.avatar_url,
      language: repoData.language,
      topics: repoData.topics,
      contributors: contributorsCount
    }
  }

  const existing = await redis.hget(TRENDING_ISSUES_KEY, repo)
  if (existing) {
    const parsed = existing as TrendingIssue
    trendingIssue.searchCount = parsed.searchCount + 1
  }

  await redis.hset(TRENDING_ISSUES_KEY, {
    [repo]: trendingIssue
  })

  await redis.zadd(TRENDING_ISSUES_KEY + ':scores', {
    score: trendingIssue.searchCount,
    member: repo
  })
}

export async function getTrendingRepos(): Promise<TrendingIssue[]> {
  // Get top repos by score using zrange with REV option
  const topRepos = await redis.zrange(
    TRENDING_ISSUES_KEY + ':scores',
    0,
    MAX_TRENDING_ISSUES - 1,
    { rev: true }
  ) as string[]

  if (!topRepos.length) return []

  // Get full issue details for each repo
  const issues = await Promise.all(
    topRepos.map(async (repo) => {
      const data = await redis.hget(TRENDING_ISSUES_KEY, repo)
      return data ? (data as TrendingIssue) : null
    })
  )

  return issues.filter((issue): issue is TrendingIssue => issue !== null)
}
