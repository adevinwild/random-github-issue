/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getRandomGitHubIssue } from "@/lib/data";
import { ExternalLink, GithubIcon } from 'lucide-react';
import Link from "next/link";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SearchInput from "../_search-input";

export default async function IssuePage({ params }: { params: { repo: string[] } }) {
  const org = params.repo[0]
  const repo = params.repo[1]

  const issue = await getRandomGitHubIssue(`${org}/${repo}`).catch(() => null)

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
        {issue
          ? (<Card className="w-full max-w-2xl min-w-[42rem]">
            <CardHeader>
              <Link href={`https://github.com/${org}/${repo}`} className="flex items-center gap-1 justify-between mb-3">
                <CardDescription className="text-blue-500 underline">@{org}/{repo}</CardDescription>
                <Button variant="outline" asChild size="sm">
                  <Link href={`https://github.com/${org}/${repo}/issues/${issue?.number}`}>
                    View on GitHub <ExternalLink className="size-4" />
                  </Link>
                </Button>
              </Link>
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
            <p className="text-sm text-neutral-500">No issue found for this repository. Please make sure the repository exists and is public.</p>
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
