'use server'

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



export const getRandomGitHubIssue = cache(async (repo: string): Promise<{ issue: GitHubIssue, expiresAt: number } | null> => {
  if (!repo) {
    throw new Error('Repository is required')
  }

  const cachedIssue = await redis.get(`issue:${repo}`) as GitHubIssue | null
  const expiresAt = await redis.ttl(`issue:${repo}`)
  if (cachedIssue) {
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
      next: { revalidate: 86400 } // 1 day cache
    })

    if (!response.ok) {
      throw new Error('Failed to fetch issues')
    }

    const issues: GitHubIssue[] = await response.json()

    if (issues.length === 0) {
      return null
    }

    const randomIssue = issues[Math.floor(Math.random() * issues.length)]
    await redis.set(`issue:${repo}`, JSON.stringify(randomIssue), { ex: 86400 })
    return {
      issue: randomIssue,
      expiresAt: 86400
    }
  } catch (error) {
    console.error('Error fetching GitHub issue:', error)
    throw error
  }
})
