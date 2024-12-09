"use client"
import { TreePine, Star } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

export default function ChristmasLogo() {
  return (
    <button className='relative' onClick={() => toast.success("Merry Christmas! 🎄")}>
      <TreePine className='text-green-500' />
      <Star className='text-yellow-400 size-2 absolute -top-1 left-1/2 z-10 -translate-x-1/2' />
      <TreePine className='absolute top-0.5 left-0.5 -z-10 text-red-500/50' />
      <TreePine className='absolute top-0.5 right-0.5 -z-10 text-red-500/50' />
    </button>
  )
}
