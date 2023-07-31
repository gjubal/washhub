import { Purchase, Payment, Subscription, Vehicle, User } from '@prisma/client'

export type PurchaseEntity = Omit<Purchase, 'userId'>
export type PaymentEntity = Omit<Payment, 'subscriptionId'>
export type SubscriptionEntity = Omit<Subscription, 'vehicleId'> & {
  payments: PaymentEntity[]
}
export type VehicleEntity = Omit<Vehicle, 'userId'> & {
  subscriptions?: SubscriptionEntity[]
}

export type UserEntity = User & {
  vehicles: VehicleEntity[]
  purchases: PurchaseEntity[]
}
