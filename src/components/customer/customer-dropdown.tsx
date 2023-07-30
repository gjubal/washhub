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

export function CustomerDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <PlusCircledIcon className="h-4 w-4 cursor-pointer" />
          <span className="sr-only">Add</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="flex items-center gap-2"
          onClick={() => console.log('clicked')}
        >
          <CarIcon className="h-4 w-4" />
          Add vehicle
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-2"
          onClick={() => console.log('clicked')}
        >
          <Clipboard className="h-4 w-4" />
          Add subscription
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
