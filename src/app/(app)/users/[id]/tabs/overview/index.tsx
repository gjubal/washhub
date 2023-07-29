'use client'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { VehiclesTable } from './vehicles/vehicles-table'
import { UserEntity } from '@/types/entities'

dayjs.extend(relativeTime)

export interface OverviewProps {
  userId: string
}

export function Overview({ userId }: OverviewProps) {
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await axios.get(`/api/users/${userId}`)
      return response.data.user as UserEntity
    },
    refetchInterval: 15 * 1000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  })

  return (
    <>
      <VehiclesTable user={user} isLoadingUser={isLoadingUser} />
    </>
  )
}
