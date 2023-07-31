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

interface DeleteVehicleParams {
  params: { id: string; vehicleId: string }
}

export async function DELETE(_: Request, { params }: DeleteVehicleParams) {
  const vehicle = await prisma.vehicle.findUniqueOrThrow({
    where: {
      id: params.vehicleId,
    },
  })

  const vehicleSubscriptions = await prisma.subscription.findMany({
    where: {
      vehicleId: vehicle.id,
    },
  })

  await prisma.payment.deleteMany({
    where: {
      subscriptionId: {
        in: vehicleSubscriptions.map((subscription) => subscription.id),
      },
    },
  })

  await prisma.subscription.deleteMany({
    where: {
      vehicleId: vehicle.id,
    },
  })

  await prisma.vehicle.delete({
    where: {
      id: vehicle.id,
    },
  })

  return NextResponse.json({ vehicle })
}
