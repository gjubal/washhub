import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { Prisma } from '@prisma/client'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const search = searchParams.get('q')
  const isPhoneNumber = Boolean(search?.match(/^\d+$/))
  const isEmail = Boolean(search?.match(/^[^@]+@[^@]+\.[^@]+$/))

  try {
    let whereCondition: Prisma.UserWhereInput | undefined

    if (isPhoneNumber) {
      whereCondition = { phoneNumber: { startsWith: search ?? undefined } }
    } else if (isEmail) {
      whereCondition = { email: { search: search ?? undefined } }
    } else if (search) {
      const nameParts = search.split(' ')
      if (nameParts.length === 1) {
        whereCondition = {
          firstName: { startsWith: nameParts[0], mode: 'insensitive' },
        }
      } else if (nameParts.length >= 2) {
        whereCondition = {
          AND: [
            { firstName: { search: nameParts[0], mode: 'insensitive' } },
            { lastName: { startsWith: nameParts[1], mode: 'insensitive' } },
          ],
        }
      }
    }

    const users = await prisma.user.findMany({
      where: whereCondition,
      orderBy: { firstName: 'asc' },
    })

    return NextResponse.json({ users })
  } catch (err) {
    console.log(err)
  }
}
