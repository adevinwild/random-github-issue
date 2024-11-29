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

export const getRandomGitHubIssue = cache(async (repo: string): Promise<GitHubIssue | null> => {
  if (!repo) {
    throw new Error('Repository is required')
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

    return issues[Math.floor(Math.random() * issues.length)]
  } catch (error) {
    console.error('Error fetching GitHub issue:', error)
    throw error
  }
})
