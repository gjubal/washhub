import Link from 'next/link'

import { PlusCircledIcon } from '@radix-ui/react-icons'

import { Button } from './ui/button'
import { NavLink } from './nav-link'

export function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-8">
        <p className="h-6 w-6">🧼</p>

        <nav className="ml-6 flex items-center space-x-4 lg:space-x-6">
          <NavLink href="/item1">Item 1</NavLink>
          <NavLink href="/item2">Item 2</NavLink>
          <NavLink href="/item3">Item 3</NavLink>
        </nav>

        <div className="ml-auto flex items-center space-x-4">
          <Button asChild>
            <Link href="/create" prefetch={false}>
              <PlusCircledIcon className="mr-2 h-4 w-4" />
              Create
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
