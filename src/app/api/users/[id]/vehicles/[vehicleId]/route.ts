import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

interface UpdateVehicleParams {
  params: { id: string; vehicleId: string }
}

export async function PUT(request: Request, { params }: UpdateVehicleParams) {
  const userId = params.id
  const { year, make, model } = await request.json()

  const vehicle = await prisma.vehicle.update({
    where: {
      id: params.vehicleId,
    },
    data: {
      year: Number(year),
      make,
      model,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  })

  if (!vehicle) {
    return NextResponse.error()
  }

  return NextResponse.json({ vehicle })
}
