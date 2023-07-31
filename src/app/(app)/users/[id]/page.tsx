import { Button } from '@/components/ui/button'
import { User2Icon } from 'lucide-react'
import { Metadata } from 'next'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Overview } from './tabs/overview'
import { Profile } from './tabs/profile'
import { Payments } from './tabs/payments'
import { Subscriptions } from './tabs/subscriptions'
import { CustomerDropdown } from '@/components/customer/customer-dropdown'

interface UserPageProps {
  params: { id: string }
}

export async function generateMetadata({
  params,
}: UserPageProps): Promise<Metadata> {
  const id = params.id

  return {
    title: `User ${id}`,
  }
}

export const dynamic = 'force-dynamic'

export default async function UserPage({ params }: UserPageProps) {
  const userId = params.id

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h2 className="truncate text-3xl font-bold tracking-tight">Customer</h2>

        <div className="flex items-center gap-2">
          <CustomerDropdown userId={userId} />
          <Button variant="secondary">
            <User2Icon className="mr-2 h-4 w-4" />
            <span>Download receipts</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Overview userId={userId} />
        </TabsContent>
        <TabsContent value="subscriptions">
          <Subscriptions userId={userId} />
        </TabsContent>
        <TabsContent value="payments">
          <Payments userId={userId} />
        </TabsContent>
        <TabsContent value="profile">
          <Profile userId={userId} />
        </TabsContent>
      </Tabs>
    </>
  )
}
