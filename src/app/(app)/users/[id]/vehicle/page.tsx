import { Metadata } from 'next'
import { VehicleForm } from '../tabs/subscriptions/vehicle-form'

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
      <h2 className="truncate text-3xl font-bold tracking-tight">Vehicle</h2>

      <VehicleForm userId={userId} />
    </>
  )
}
