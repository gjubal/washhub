import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const userId = params.id
  const { year, make, model } = await request.json()

  const vehicle = await prisma.vehicle.create({
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
