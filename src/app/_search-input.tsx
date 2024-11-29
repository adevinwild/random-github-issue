"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react';
import React, { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const FAMOUS_REPOS_PLACEHOLDERS = [
  "medusajs/medusa",
  "calcom/cal.com",
  "open-sauced/open-sauced",
  "vercel/next.js",
  "facebook/react",
  "microsoft/vscode",
  "kubernetes/kubernetes",
  "denoland/deno",
  "sveltejs/svelte",
  "tailwindlabs/tailwindcss",
  "prisma/prisma",
  "trpc/trpc",
  "remix-run/remix"
  // 🤍 Feel free to open issues to add your favorite repos here!
]

const useRandomPlaceholder = () => {
  const [placeholder] = useState(() => {
    return FAMOUS_REPOS_PLACEHOLDERS[Math.floor(Math.random() * FAMOUS_REPOS_PLACEHOLDERS.length)];
  });
  return placeholder;
}

export default function SearchInput() {
  const [searchInput, setSearchInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const placeholder = useRandomPlaceholder();
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return

    const regexIssue = /^[a-zA-Z0-9-]+\/[a-zA-Z0-9-_.]+$/;
    if (!regexIssue.test(searchInput)) {
      setError("Invalid repository format. Please use the format 'owner/repo'.");
      return;
    }

    startTransition(() => {
      router.push(`/${searchInput}`);
    })
  }

  return (
    <form className='flex items-center gap-x-2 w-full relative' onSubmit={handleSubmit}>
      <Input placeholder={`e.g. ${placeholder}`} className='w-full ring-none focus-visible:ring-offset-0' value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
      <AnimatePresence>
        {searchInput && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
          >
            <Button type="submit" disabled={isPending} className={cn(
              'absolute right-1 top-1/2 -translate-y-1/2 h-10',
              !searchInput ? 'rounded-lg' : 'rounded-l-none rounded-r-lg'
            )} size="icon">
              <span className='sr-only'>Search</span>
              {isPending ? <Loader2 className='size-4 animate-spin' /> : <Search className='size-4' />}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
    </form>
  )
}
