import SearchInput from "./_search-input";
import Footer from "./_footer";
import Header from "./_header";
import { getTrendingRepos } from "@/lib/data";
import Link from "next/link";
import { ExternalLink, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'Random GitHub Issue',
  description: 'Get a daily random issue suggestion from any GitHub repository. Perfect for developers looking for new contribution opportunities in open source projects.',
  keywords: ['GitHub', 'daily issues', 'open source', 'random', 'contribution suggestions', 'developer tools'],
  authors: [{
    name: 'Adil BASRI (adevinwild)',
    url: 'https://github.com/adevinwild'
  }],
  creator: 'adevinwild',
  openGraph: {
    title: 'Random GitHub Issue',
    description: 'Get a daily random issue suggestion from any GitHub repository',
    type: 'website',
    siteName: 'Random GitHub Issue Explorer',
    url: 'https://randomgithubissue.org',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Random GitHub Issue',
    description: 'Get a daily random issue suggestion from any GitHub repository',
    creator: '@adevinwild',
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL('https://randomgithubissue.org'),
};

export default async function Home() {
  const trendingRepos = await getTrendingRepos()
  const sortedByScore = trendingRepos.sort((a, b) => b.searchCount - a.searchCount)

  return (
    <div className="min-h-dvh p-10 sm:p-20 md:max-w-screen-lg mx-auto flex flex-col gap-4">
      <Header />
      <main
        className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full"
        role="main"
        aria-labelledby="main-heading"
      >
        <section aria-label="Repository search" className="w-full h-max">
          <SearchInput />
        </section>
        <hr className="w-full border-neutral-200 dark:border-neutral-800" aria-hidden="true" />
        <section aria-labelledby="trending-heading" className="w-full flex flex-col gap-2">
          <h2 id="trending-heading" className="text-lg font-medium">Most searched repositories</h2>
          <div className="grid w-full" role="list">
            {sortedByScore.map(({ repo, repoMetadata }) => (
              <article
                key={repo}
                className="flex items-center justify-between gap-2 w-full py-0.5"
                role="listitem"
              >
                <Link
                  href={`/${repo}`}
                  className="hover:underline text-neutral-500 dark:text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                >
                  <span className="sr-only">View details for </span>
                  {repo}
                </Link>
                <div className="flex items-center gap-2">
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center gap-1 text-neutral-400">
                          <span aria-label={`${repoMetadata?.contributors || 0} contributors`} className="text-sm">
                            {new Intl.NumberFormat('en-US', { notation: 'compact' }).format(repoMetadata?.contributors || 0)}
                          </span>
                          <Users className="size-4" aria-hidden="true" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Contributors</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center gap-1 text-neutral-400">
                          <span aria-label={`${repoMetadata?.stars || 0} stars`} className="text-sm">
                            {new Intl.NumberFormat('en-US', { notation: 'compact' }).format(repoMetadata?.stars || 0)}
                          </span>
                          <Star className="size-4" aria-hidden="true" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Stars</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                  >
                    <Link
                      href={`https://github.com/${repo}`}
                      rel="noopener noreferrer"
                      target="_blank"
                      aria-label={`Open ${repo} on GitHub in new tab`}
                    >
                      <ExternalLink className="size-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
