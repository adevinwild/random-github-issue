/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getRandomGitHubIssue } from "@/lib/data";
import { Clock, ExternalLink, Frown } from 'lucide-react';
import Link from "next/link";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { formatDistanceToNow } from 'date-fns';

import SearchInput from "../_search-input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Footer from "../_footer";
import Header from "../_header";

export const dynamic = 'force-dynamic'
export const revalidate = 86400

export default async function IssuePage({ params }: { params: { repo: string[] } }) {
  const org = params.repo[0]
  const repo = params.repo[1]

  const result = await getRandomGitHubIssue(`${org}/${repo}`).catch(() => null)
  const issue = result?.issue
  const expiresAt = result?.expiresAt

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Header />
        <SearchInput />
        <hr className="w-full" />
        {expiresAt && (
          <Alert variant="expires">
            <Clock className="size-4" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              {(() => {
                const now = new Date();
                const futureDate = new Date(now.getTime() + (expiresAt * 1000));
                return (
                  <p>
                    A new random issue will be available in <span className="font-medium">{formatDistanceToNow(futureDate, {
                      addSuffix: false,
                      includeSeconds: false
                    })}</span> for <span className="font-medium">{`@${org}/${repo}`}</span>
                  </p>
                );
              })()}
            </AlertDescription>
          </Alert>
        )}

        {issue
          ? (
            <Card className="w-full max-w-[calc(100dvw-4rem)] md:max-w-2xl md:min-w-[42rem]">
              <CardHeader>
                <div className="flex items-center gap-1 justify-between mb-3">
                  <Link href={`https://github.com/${org}/${repo}`}>
                    <CardDescription className="text-blue-500 underline">@{org}/{repo}</CardDescription>
                  </Link>
                  <Button variant="outline" asChild size="sm" className="hidden md:flex">
                    <Link href={`https://github.com/${org}/${repo}/issues/${issue?.number}`}>
                      <span>View on GitHub</span>
                      <ExternalLink className="size-4" />
                    </Link>
                  </Button>
                </div>
                <Link href={`https://github.com/${org}/${repo}/issues/${issue?.number}`}>
                  <CardTitle className="my-1 pb-1 underline text-blue-500 text-wrap break-words flex items-center gap-2">
                    <span>
                      {issue?.title}{' '}
                    </span>
                    <ExternalLink className="size-4 shrink-0 md:hidden" />
                  </CardTitle>
                </Link>
              </CardHeader>
              <CardContent className="overflow-auto">
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
                      <pre className="bg-gray-100 font-mono overflow-auto text-sm md:text-base ring-1 ring-neutral-200 p-4 rounded mb-4" {...props} />
                  }}
                >
                  {issue?.body ?? "No description was found for this issue."}
                </ReactMarkdown>
              </CardContent>
            </Card>
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
