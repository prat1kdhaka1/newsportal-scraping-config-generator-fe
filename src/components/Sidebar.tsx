'use client'
import { Stack } from '@mantine/core'
import Link from 'next/link'
import React from 'react'

const Sidebar = () => {
  return (
    <Stack p={5}>
      <Link href="/" className='text-black'>Home</Link>
      <Link href="/dashboard" className='text-black'>Dashboard</Link>
      <Link href="/schedules" className='text-black'>Schedules</Link>

    </Stack>
  )
}

export default Sidebar
