import { Metadata } from 'next'
import { VehicleForm } from '../tabs/subscriptions/vehicle-form'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface CreateVehicleProps {
  params: { id: string }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Add vehicle`,
  }
}

export const dynamic = 'force-dynamic'

export default async function CreateVehicle({ params }: CreateVehicleProps) {
  const userId = params.id

  return (
    <>
      <div className="flex justify-between">
        <h2 className="truncate text-3xl font-bold tracking-tight">Vehicle</h2>
        <Link href={`/users/${userId}`}>
          <Button variant="link" size="icon">
            <ArrowLeft className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <span className="sr-only">Go back</span>
          </Button>
        </Link>
      </div>

      <VehicleForm userId={userId} />
    </>
  )
}
