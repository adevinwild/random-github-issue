import SearchInput from "./_search-input";
import Footer from "./_footer";
import Header from "./_header";
import { getTrendingRepos } from "@/lib/data";
import Link from "next/link";
import { ExternalLink, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default async function Home() {
  const trendingRepos = await getTrendingRepos()
  const sortedByScore = trendingRepos.sort((a, b) => b.searchCount - a.searchCount)
  console.log(sortedByScore)

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Header />
        <SearchInput />
        <hr className="w-full border-neutral-200 -my-4" />
        <h3 className="text-lg font-medium">Most searched</h3>
        <div className="flex flex-col gap-2 w-full -mt-6">
          {sortedByScore.map(({ repo, repoMetadata }) => (
            <article key={repo} className="flex items-center justify-between gap-2 w-full py-2">
              <Link
                href={`/${repo}`}
                className="hover:underline"
                aria-label={`View details for ${repo}`}
              >
                {repo}
              </Link>
              <div className="flex items-center gap-2" aria-label={`Repository statistics for ${repo}`}>
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center gap-1 text-neutral-400">
                        <span className="text-sm" aria-label="Contributors">
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
                        <span className="text-sm" aria-label="Stars">
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
                  aria-label={`Open ${repo} on GitHub (opens in new tab)`}
                >
                  <Link href={`https://github.com/${repo}`} rel="noopener noreferrer" target="_blank">
                    <ExternalLink className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
