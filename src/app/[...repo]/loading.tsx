"use client"

import Header from '../_header'
import Footer from '../_footer'
import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Header />
        <div className='w-full h-full flex items-center justify-center'>
          <Loader2 className='size-6 animate-spin' />
        </div>
      </main>
      <Footer />
    </div>
  )
}
