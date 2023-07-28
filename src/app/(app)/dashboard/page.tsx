import { Metadata } from 'next'
import { TotalUserCount } from '@/components/summary/total-user-count'
import { TotalMembershipCount } from '@/components/summary/total-membership-count'
import { Search } from '@/components/search'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'WashHub Dashboard',
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex w-full justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

        <Search />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TotalUserCount />
        <TotalMembershipCount />
      </div>
    </div>
  )
}
