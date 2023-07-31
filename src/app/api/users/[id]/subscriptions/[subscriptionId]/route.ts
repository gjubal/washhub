import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface SubscriptionsParams {
  params: {
    id: string
    subscriptionId: string
  }
}

export async function PUT(request: Request, { params }: SubscriptionsParams) {
  const { id: userId, subscriptionId } = params
  const { newVehicleId } = await request.json()

  const subscription = await prisma.subscription.update({
    where: { id: subscriptionId },
    data: { vehicleId: newVehicleId },
  })

  return NextResponse.json({ subscription })
}

export async function DELETE(_: Request, { params }: SubscriptionsParams) {
  const { id: userId, subscriptionId } = params

  const subscription = await prisma.subscription.delete({
    where: { id: subscriptionId },
  })

  if (!subscription) return NextResponse.error()

  return NextResponse.json({ status: 'success' })
}
