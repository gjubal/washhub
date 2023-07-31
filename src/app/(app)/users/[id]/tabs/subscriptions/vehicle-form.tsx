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
import { useRouter } from 'next/navigation'
import { VehicleEntity } from '@/types/entities'
import { useToast } from '@/hooks/useToast'

interface VehicleFormProps {
  userId: string
  vehicle?: Omit<VehicleEntity, 'subscriptions'>
}

const vehicleFormSchema = z.object({
  year: z
    .string()
    .min(4, { message: 'Please provide a valid year.' })
    .refine((value) => !isNaN(Number(value)), {
      message: 'Please provide a valid year.',
    })
    .refine((value) => Number(value) > 1900, {
      message: 'Please provide a valid year.',
    })
    .refine((value) => Number(value) < 2100, {
      message: 'Please provide a valid year.',
    })
    .refine((value) => Number.isInteger(Number(value)), {
      message: 'Please provide a valid year.',
    })
    .refine((value) => value.length === 4, {
      message: 'Please provide a valid year.',
    })
    .refine((value) => value[0] !== '0', {
      message: 'Please provide a valid year.',
    }),
  make: z.string().min(2, { message: 'Please provide a valid make.' }),
  model: z.string().min(2, { message: 'Please provide a valid model.' }),
})

export type VehicleFormSchema = z.infer<typeof vehicleFormSchema>

export function VehicleForm({ userId, vehicle }: VehicleFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const vehicleForm = useForm<VehicleFormSchema>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      year: vehicle?.year.toString(),
      make: vehicle?.make,
      model: vehicle?.model,
    },
  })

  const { mutateAsync: createVehicle } = useMutation(
    async (data: VehicleFormSchema) => {
      await axios.post(`/api/users/${userId}/vehicles`, data)
    },
  )

  const { mutateAsync: updateVehicle } = useMutation(
    async (data: VehicleFormSchema) => {
      await axios.put(`/api/users/${userId}/vehicles/${vehicle?.id}`, data)
    },
  )

  const { mutateAsync: deleteVehicle } = useMutation(async () => {
    await axios.delete(`/api/users/${userId}/vehicles/${vehicle?.id}`)
  })

  async function onSaveVehicle(data: VehicleFormSchema) {
    try {
      if (vehicle?.id) {
        await updateVehicle(data)
      } else {
        await createVehicle(data)
      }
      router.back()
    } catch {
      toast({
        title: 'Uh oh! Something went wrong.',
        description: `An error ocurred while trying to save changes.`,
        variant: 'destructive',
      })
    }
  }

  async function onDeleteVehicle() {
    try {
      await deleteVehicle()
      router.back()
    } catch {
      toast({
        title: 'Uh oh! Something went wrong.',
        description: `An error ocurred while trying to delete the vehicle.`,
        variant: 'destructive',
      })
    }
  }

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = vehicleForm

  return (
    <FormProvider {...vehicleForm}>
      <form onSubmit={handleSubmit(onSaveVehicle)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="year">Year </Label>
          <Input id="year" {...register('year')} />
          {errors.year && (
            <p className="text-sm font-medium text-red-500 dark:text-red-400">
              {errors.year.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="make">Make</Label>
          <Input id="make" {...register('make')} />
          {errors.make && (
            <p className="text-sm font-medium text-red-500 dark:text-red-400">
              {errors.make.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input id="model" {...register('model')} />
          {errors.model && (
            <p className="text-sm font-medium text-red-500 dark:text-red-400">
              {errors.model.message}
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
          {vehicle?.id && (
            <Button
              className="w-24 bg-red-500"
              type="button"
              disabled={isSubmitting}
              onClick={onDeleteVehicle}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Delete'
              )}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  )
}
