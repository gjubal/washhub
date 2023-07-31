import { Metadata } from 'next'
import { VehicleForm } from '../../tabs/subscriptions/vehicle-form'
import { prisma } from '@/lib/db'

interface UpdateVehicleProps {
  params: { id: string; vehicleId: string }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Update vehicle`,
  }
}

export const dynamic = 'force-dynamic'

export default async function UpdateVehicle({ params }: UpdateVehicleProps) {
  const userId = params.id

  const vehicle = await prisma.vehicle.findUnique({
    where: {
      id: params.vehicleId,
    },
  })

  return (
    <>
      <h2 className="truncate text-3xl font-bold tracking-tight">Vehicle</h2>

      <VehicleForm userId={userId} vehicle={vehicle ?? undefined} />
    </>
  )
}
