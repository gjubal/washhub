import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { prisma } from '@/lib/db'
import { UserForm } from './user-form'

export interface ProfileProps {
  userId: string
}

export async function Profile({ userId }: ProfileProps) {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: userId,
    },
  })

  return (
    <div className="grid flex-1 grid-cols-[1fr_minmax(320px,480px)] gap-4">
      <Card className="self-start">
        <CardHeader>
          <CardTitle>Edit customer</CardTitle>
          <CardDescription>Update customer details</CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm user={user} />
        </CardContent>
      </Card>
    </div>
  )
}
