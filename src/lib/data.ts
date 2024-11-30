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
    return {
      issue: minimalIssue,
      expiresAt: ttl
    }
  } catch (error) {
    console.error('Error fetching GitHub issue:', error)
    throw error
  }
})
