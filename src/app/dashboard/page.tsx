import { Metadata } from 'next'
import { TotalUserCount } from '../../components/summary/total-user-count'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'WashHub Dashboard',
}

export default function DashboardPage() {
  return (
    <>
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <div className="grid grid-cols-2 gap-4">
        <TotalUserCount />
      </div>
    </>
  )
}
