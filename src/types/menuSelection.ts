export type DrinkPackage = 'non-alcoholic' | 'alcoholic'

export interface MenuSelection {
  starter: string
  main: string
  dessert: string
  drinks: DrinkPackage
  drinkSurcharge: number
}

export interface RestaurantReservation {
  firstName: string
  lastName: string
  classGroup: string
  email: string
  phone: string
  menuSelection: MenuSelection
  totalSurcharge: number
  accessCode: string
}

export interface GothamRegistration {
  firstName: string
  lastName: string
  email: string
  ticketType: 'primaner' | 'external'
  price: number
}
