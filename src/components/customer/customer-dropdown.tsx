'use client'

import * as React from 'react'
import { CarIcon, Clipboard } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PlusCircledIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

export function CustomerDropdown({ userId }: { userId: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <PlusCircledIcon className="h-4 w-4 cursor-pointer" />
          <span className="sr-only">Add</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Link href={`/users/${userId}/vehicle`} prefetch={false}>
          <DropdownMenuItem className="flex cursor-pointer items-center gap-2">
            <CarIcon className="h-4 w-4" />
            Add vehicle
          </DropdownMenuItem>
        </Link>
        <Link href={`/users/${userId}/subscription`} prefetch={false}>
          <DropdownMenuItem className="flex cursor-pointer items-center gap-2">
            <Clipboard className="h-4 w-4" />
            Add subscription
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
