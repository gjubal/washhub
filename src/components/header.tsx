import Link from 'next/link'

import { PlusCircledIcon } from '@radix-ui/react-icons'

import { Button } from './ui/button'
import { NavLink } from './nav-link'
import { ThemeSwitcher } from './theme-switcher'
import { UserProfileButton } from './user-profile-button'

export function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center gap-8 px-8">
        <p className="text-2xl">🧼</p>

        <nav className="ml-6 flex w-96 items-center space-x-4 lg:space-x-6">
          <NavLink href="/dashboard">Dashboard</NavLink>
        </nav>

        <div className="ml-auto flex items-center space-x-4">
          <Button asChild>
            <Link href="/create" prefetch={false}>
              <PlusCircledIcon className="mr-2 h-4 w-4" />
              Create
            </Link>
          </Button>
          <ThemeSwitcher />
          <UserProfileButton />
        </div>
      </div>
    </div>
  )
}
