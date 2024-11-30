/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getRandomGitHubIssue } from "@/lib/data";
import { Clock, ExternalLink, GithubIcon, Frown, X } from 'lucide-react';
import Link from "next/link";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { formatDistanceToNow } from 'date-fns';

import SearchInput from "../_search-input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

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
        <Link href="/" className="flex items-center gap-2 w-full">
          <GithubIcon />
          <div className="flex flex-col gap-0.5">
            <h1 className="text-2xl font-bold">Random GitHub Issue</h1>
            <p className="text-sm text-neutral-500">
              A random opened GitHub issue per day for any repository.
            </p>
          </div>
        </Link>
        <SearchInput />
        <hr className="w-full" />
        {expiresAt && (
          <Alert variant="info">
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
            <Card className="w-full max-w-2xl min-w-[42rem]">
              <CardHeader>
                <div className="flex items-center gap-1 justify-between mb-3">
                  <Link href={`https://github.com/${org}/${repo}`}>
                    <CardDescription className="text-blue-500 underline">@{org}/{repo}</CardDescription>
                  </Link>
                  <Button variant="outline" asChild size="sm">
                    <Link href={`https://github.com/${org}/${repo}/issues/${issue?.number}`}>
                      View on GitHub <ExternalLink className="size-4" />
                    </Link>
                  </Button>
                </div>
                <CardTitle className="my-1 pb-1">{issue?.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({ node, ...props }) => <a className="text-blue-500 hover:underline" {...props} />,
                    p: ({ node, ...props }) => <p className="mb-4" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4" {...props} />,
                    h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-2" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-xl font-bold mb-2" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-lg font-bold mb-2" {...props} />,
                    code: ({ node, ...props }) =>
                      <code className="bg-gray-100 rounded px-1" {...props} />
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
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <p className="text-sm text-neutral-400">
          Based on this <Link href="https://x.com/peer_rich/status/1862609684768649570" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-neutral-700">tweet</Link>,{" "}
          made by <Link href="https://x.com/adevinwild" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-neutral-700">adevinwild</Link>
        </p>
      </footer>
    </div>
  );
}
