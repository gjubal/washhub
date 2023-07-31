'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { CheckCircledIcon } from '@radix-ui/react-icons'
import { User } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/useToast'

interface UserFormProps {
  user: User
}

const editUserFormSchema = z.object({
  email: z.string().email({ message: 'Please provide a valid email.' }),
  firstName: z
    .string()
    .min(2, { message: 'Please provide a valid first name.' })
    .optional(),
  lastName: z
    .string()
    .min(2, { message: 'Please provide a valid last name.' })
    .optional(),
  phoneNumber: z
    .string()
    .optional()
    .refine(
      (value) =>
        value &&
        /^(?:\+1)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(
          value,
        ),
      {
        message: 'Invalid phone number format',
      },
    ),
})

export type EditUserFormSchema = z.infer<typeof editUserFormSchema>

export function UserForm({ user }: UserFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const editUserForm = useForm<EditUserFormSchema>({
    resolver: zodResolver(editUserFormSchema),
    defaultValues: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber ?? '',
    },
  })

  const { mutateAsync: updateUser } = useMutation(
    async (data: EditUserFormSchema) => {
      await axios.put(`/api/users/${user.id}`, data)
    },
  )

  const { mutateAsync: deleteUser } = useMutation(async () => {
    await axios.delete(`/api/users/${user.id}`)
  })

  async function onSaveUser(data: EditUserFormSchema) {
    try {
      await updateUser(data)
    } catch {
      toast({
        title: 'Uh oh! Something went wrong.',
        description: `An error ocurred while trying to save changes.`,
        variant: 'destructive',
      })
    }
  }

  async function onDeleteUser() {
    try {
      await deleteUser()
      router.push('/dashboard')
    } catch {
      toast({
        title: 'Uh oh! Something went wrong.',
        description: `An error ocurred while trying to delete the user.`,
        variant: 'destructive',
      })
    }
  }

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = editUserForm

  return (
    <FormProvider {...editUserForm}>
      <form onSubmit={handleSubmit(onSaveUser)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email </Label>
          <Input id="email" {...register('email')} />
          {errors.email && (
            <p className="text-sm font-medium text-red-500 dark:text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name </Label>
          <Input id="firstName" {...register('firstName')} />
          {errors.firstName && (
            <p className="text-sm font-medium text-red-500 dark:text-red-400">
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name </Label>
          <Input id="lastName" {...register('lastName')} />
          {errors.lastName && (
            <p className="text-sm font-medium text-red-500 dark:text-red-400">
              {errors.lastName.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number </Label>
          <Input id="phoneNumber" {...register('phoneNumber')} />
          {errors.phoneNumber && (
            <p className="text-sm font-medium text-red-500 dark:text-red-400">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Button className="w-24" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Save'
            )}
          </Button>
          {isSubmitSuccessful && (
            <div className="flex items-center gap-2 text-sm text-emerald-500 dark:text-emerald-400">
              <CheckCircledIcon className="h-3 w-3" />
              <span>Saved!</span>
            </div>
          )}
          <Button
            className="w-24 bg-red-500"
            type="button"
            disabled={isSubmitting}
            onClick={onDeleteUser}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Delete'
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
