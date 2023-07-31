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
import { Subscription, Vehicle } from '@prisma/client'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SubscriptionFormProps {
  userId: string
  subscription?: Omit<Subscription, 'vehicleId'> & {
    vehicle: {
      id: string
      year: number
      make: string
      model: string
    }
  }
  vehicles: Omit<Vehicle, 'userId'>[]
}

const subscriptionFormSchema = z.object({
  currentVehicle: z
    .string()
    .min(2, { message: 'Please provide a valid vehicle.' }),
  newVehicleId: z
    .string()
    .min(2, { message: 'Please provide a valid vehicle ID.' }),
  type: z.enum(['annual', 'monthly']).optional(),
  price: z.number().optional(),
})

export type SubscriptionFormSchema = z.infer<typeof subscriptionFormSchema>

export function SubscriptionForm({
  userId,
  subscription,
  vehicles,
}: SubscriptionFormProps) {
  const router = useRouter()
  const subscriptionForm = useForm<SubscriptionFormSchema>({
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues: {
      currentVehicle:
        subscription?.id &&
        `${subscription.vehicle.year} ${subscription.vehicle.make} ${subscription.vehicle.model}`,
    },
  })

  const { mutateAsync: updateSubscription } = useMutation(
    async (data: SubscriptionFormSchema) => {
      await axios.put(
        `/api/users/${userId}/subscription/${subscription?.id}`,
        data,
      )
    },
  )

  const { mutateAsync: deleteSubscription } = useMutation(async () => {
    await axios.delete(`/api/users/${userId}/subscriptions/${subscription?.id}`)
  })

  async function onSaveSubscription(data: SubscriptionFormSchema) {
    try {
      if (subscription?.id) {
        await updateSubscription(data)
      } else {
        // await createSubscription(data)
      }
    } catch {
      console.log('Error saving the subscription')
    }
  }

  async function onDeleteSubscription() {
    try {
      await deleteSubscription()
      router.push('/dashboard')
    } catch {
      console.log('Error deleting the subscription')
    }
  }

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = subscriptionForm

  return (
    <FormProvider {...subscriptionForm}>
      <form onSubmit={handleSubmit(onSaveSubscription)} className="space-y-4">
        <div className="space-y-2">
          {subscription?.id ? (
            <>
              <Label htmlFor="currentVehicle">Current vehicle</Label>
              <Input
                id="currentVehicle"
                {...register('currentVehicle')}
                readOnly={!!subscription?.id}
              />
              {errors.currentVehicle && (
                <p className="text-sm font-medium text-red-500 dark:text-red-400">
                  {errors.currentVehicle.message}
                </p>
              )}
            </>
          ) : (
            <>
              <Label htmlFor="type">Type</Label>
              <Select>
                <SelectTrigger aria-label="Types">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="annual">Annual</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm font-medium text-red-500 dark:text-red-400">
                  {errors.type.message}
                </p>
              )}
            </>
          )}
        </div>
        <div className="space-y-2">
          {!subscription?.id && (
            <>
              <Label htmlFor="price">Price ($)</Label>
              <Input id="price" {...register('price')} placeholder="39.99" />
              {errors.price && (
                <p className="text-sm font-medium text-red-500 dark:text-red-400">
                  {errors.price.message}
                </p>
              )}
            </>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="newVehicleId">
            {subscription?.id ? 'New Vehicle' : 'Vehicle'}
          </Label>
          <Select>
            <SelectTrigger aria-label="Vehicles">
              <SelectValue placeholder="Select a vehicle" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {vehicles.map(
                  (vehicle) =>
                    vehicle.id !== subscription?.vehicle.id && (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </SelectItem>
                    ),
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.newVehicleId && (
            <p className="text-sm font-medium text-red-500 dark:text-red-400">
              {errors.newVehicleId.message}
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
          {subscription?.id && (
            <Button
              className="w-24 bg-red-500"
              type="button"
              disabled={isSubmitting}
              onClick={onDeleteSubscription}
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