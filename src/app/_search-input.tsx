"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react';
import React, { useEffect, useState, useTransition } from 'react';
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

const PLACEHOLDER_INTERVAL = 3200 // 3.2 seconds

const useRandomPlaceholder = () => {
  const [placeholder, setPlaceholder] = useState<string | null>(null);
  const [lastIndex, setLastIndex] = useState<number>(-1);

  useEffect(() => {
    const getRandomIndex = (exclude: number) => {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * FAMOUS_REPOS_PLACEHOLDERS.length);
      } while (newIndex === exclude);
      return newIndex;
    };

    const initialIndex = getRandomIndex(-1);
    setLastIndex(initialIndex);
    setPlaceholder(FAMOUS_REPOS_PLACEHOLDERS[initialIndex]);

    const interval = setInterval(() => {
      const newIndex = getRandomIndex(lastIndex);
      setLastIndex(newIndex);
      setPlaceholder(FAMOUS_REPOS_PLACEHOLDERS[newIndex]);
    }, PLACEHOLDER_INTERVAL);

    return () => clearInterval(interval);
  }, [lastIndex]);

  return placeholder;
}

const AnimatedPlaceholder = ({ text }: { text: string | null }) => (
  <AnimatePresence mode="wait">
    {text && (
      <motion.span
        key={text}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="text-sm text-neutral-500 pointer-events-none"
      >
        <span className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:left-3 md:translate-x-0 text-nowrap whitespace-nowrap'>
          e.g. {text}
        </span>
      </motion.span>
    )}
  </AnimatePresence>
);

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
    <form className='flex md:flex-row flex-col items-center gap-y-1.5 md:gap-x-2 w-full relative' onSubmit={handleSubmit}>
      <div className="relative w-full">
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className='w-full ring-none border-none shadow-none ring-1 ring-neutral-200 duration-300 focus-visible:ring-offset-0 focus-visible:ring-1 text-center md:text-left'
        />
        {!searchInput && placeholder !== null && <AnimatedPlaceholder text={placeholder} />}
      </div>
      <AnimatePresence>
        {searchInput && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              <Button type="submit" disabled={isPending} className={cn(
                'absolute md:flex hidden right-2 top-1/2 -translate-y-1/2 h-10',
                !searchInput ? 'rounded-lg' : 'rounded-l-none rounded-r'
              )} size="icon">
                <span className='sr-only'>Search</span>
                {isPending ? <Loader2 className='size-4 animate-spin' /> : <Search className='size-4' />}
              </Button>
            </motion.div>
            <Button type="submit" disabled={isPending} className='w-full md:hidden'>
              <span>Search</span>
              {isPending ? <Loader2 className='size-4 animate-spin' /> : <Search className='size-4' />}
            </Button>
          </>
        )}
      </AnimatePresence>
      {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
    </form>
  )
}

