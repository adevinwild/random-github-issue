"use client"

import Header from '../../components/header'
import Footer from '../_footer'
import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-dvh p-10 sm:p-20 md:max-w-screen-lg mx-auto flex flex-col gap-4">
      <Header />
      <main
        className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full"
        role="main"
        aria-labelledby="main-heading"
      >
        <div className='w-full h-full flex items-center justify-center min-h-[20rem]'>
          <Loader2 className='size-6 animate-spin' />
        </div>
      </main>
      <Footer />
    </div>
  )
}
