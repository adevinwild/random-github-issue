/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getRandomGitHubIssue } from "@/lib/data";
import { Clock, ExternalLink, Frown } from 'lucide-react';
import Link from "next/link";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { formatDistanceToNow } from 'date-fns';
import { Metadata } from 'next';

import SearchInput from "../_search-input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Footer from "../_footer";
import Header from "../_header";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import Loading from "./loading";

export const dynamic = 'force-dynamic'
export const revalidate = 86400

// Generate metadata for better SEO
export async function generateMetadata({ params }: { params: { repo: string[] } }): Promise<Metadata> {
  const org = params.repo[0]
  const repo = params.repo[1]

  return {
    title: `Random Issue from ${org}/${repo} | GitHub Issue Explorer`,
    description: `Explore random issues from ${org}/${repo} GitHub repository. Find interesting problems to solve and contribute to open source.`,
    openGraph: {
      title: `Random Issue from ${org}/${repo}`,
      description: `Discover random issues from ${org}/${repo} GitHub repository`,
      type: 'website',
    },
  }
}

export default async function IssuePage({ params }: { params: { repo: string[] } }) {
  const org = params.repo[0]
  const repo = params.repo[1]

  const result = await getRandomGitHubIssue(`${org}/${repo}`).catch(() => null)
  const issue = result?.issue
  const expiresAt = result?.expiresAt

  return (
    <div className="min-h-dvh p-10 md:max-w-screen-lg sm:p-20 mx-auto flex flex-col gap-4 w-full">
      <Header />
      <main
        className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full"
        role="main"
        aria-labelledby="main-heading"
      >
        <section aria-label="Repository Search" className="w-full">
          <SearchInput />
        </section>
        <hr className="w-full" role="separator" aria-hidden="true" />
        {issue ? (
          <article className="w-full relative" aria-labelledby="issue-title">
            <Card className="w-full pt-6 sm:pt-0">
              <CardHeader>
                <div className="flex items-center gap-1 justify-between mb-5">
                  <Link href={`https://github.com/${org}/${repo}`} aria-label={`Visit ${org}/${repo} on GitHub`}>
                    <CardDescription className="text-blue-500 dark:text-blue-400 underline">@{org}/{repo}</CardDescription>
                  </Link>
                  <Button variant="link" asChild size="sm" className="hidden md:flex">
                    <Link href={`https://github.com/${org}/${repo}/issues/${issue?.number}`} aria-label="View issue on GitHub">
                      <span>View on GitHub</span>
                      <ExternalLink className="size-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
                <Link
                  href={`https://github.com/${org}/${repo}/issues/${issue?.number}`}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="text-wrap break-words flex items-center gap-2"
                  id="issue-title"
                >
                  <CardTitle className="underline text-blue-500 dark:text-blue-400 flex items-center gap-2 text-base md:text-xl">
                    <span>
                      {issue?.title}{' '}
                    </span>
                    <ExternalLink className="size-4 shrink-0 md:hidden" aria-hidden="true" />
                  </CardTitle>
                </Link>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-neutral-400 dark:text-neutral-500">
                    <span className="text-neutral-500 dark:text-neutral-400">#{issue?.number}</span> opened by
                  </span>
                  <Link
                    href={`https://github.com/${issue?.user.login}`}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="flex items-center gap-1 underline text-blue-500 dark:text-blue-400 hover:-translate-y-0.5 transition-transform duration-200"
                    aria-label={`View ${issue?.user.login}'s GitHub profile`}
                  >
                    <Avatar className="size-6 border rounded-full overflow-hidden">
                      <AvatarImage src={issue?.user.avatar_url} alt={`${issue?.user.login}'s avatar`} />
                      <AvatarFallback>{issue?.user.login.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">
                      {issue?.user.login}
                    </span>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="overflow-auto border-t pt-4">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({ node, ...props }) => <a className="text-blue-500 hover:underline" {...props} />,
                    p: ({ node, ...props }) => <p className="mb-4" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4" {...props} />,
                    h1: ({ node, ...props }) => <h1 className="text-xl md:text-2xl font-bold mb-2" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-lg md:text-xl font-bold mb-2" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-base md:text-lg font-bold mb-2" {...props} />,
                    code: ({ node, ...props }) =>
                      <code className="bg-gray-100 font-mono text-sm md:text-base" {...props} />,
                    blockquote: ({ node, ...props }) =>
                      <blockquote className="bg-gray-100 font-mono text-sm md:text-base ring-1 ring-neutral-200 p-4 rounded mb-4" {...props} />,
                    pre: ({ node, ...props }) =>
                      <pre className="bg-gray-100 font-mono overflow-auto text-sm md:text-base ring-1 ring-neutral-200 p-4 rounded mb-4" {...props} />,
                    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
                    img: ({ node, ...props }) => <img className="w-full rounded-sm" {...props} />,
                  }}
                >
                  {issue?.body ?? "No description was found for this issue."}
                </ReactMarkdown>
              </CardContent>
            </Card>
            {expiresAt && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-2.5 py-1.5 bg-white/50 border border-neutral-200 dark:bg-neutral-950/50  dark:border-neutral-800 backdrop-blur rounded-lg justify-center">
                <Clock className="size-5" />
                {(() => {
                  const now = new Date();
                  const futureDate = new Date(now.getTime() + (expiresAt * 1000));
                  return (
                    <span className="text-sm text-balance text-center">
                      Next issue in {' '}
                      <span className="font-medium">
                        {formatDistanceToNow(futureDate, {
                          addSuffix: false,
                          includeSeconds: false,
                        })}
                      </span>
                    </span>
                  );
                })()}
              </div>
            )}
          </article>
        ) : (
          <Alert variant="destructive">
            <Frown className="size-4" />
            <AlertTitle>No issue found</AlertTitle>
            <AlertDescription>Please make sure the repository exists, is public, and has at least one opened issue.</AlertDescription>
          </Alert>
        )}
      </main>

      <Footer />
    </div>
  );
}
