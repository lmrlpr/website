export type ProductColor = 'Red' | 'Black' | 'Grey' | 'Green'
export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'

export interface Product {
  id: string
  name: string
  price: number | null
  colors: ProductColor[]
  sizes: ProductSize[]
}

export interface CartItem {
  productId: string
  productName: string
  color: ProductColor
  size: ProductSize
  price: number
  quantity: number
}

export interface ReservationForm {
  name: string
  email: string
  phone: string
  starter: string
  main: string
  dessert: string
  drinks: 'sans-alcool' | 'avec-alcool'
}

export interface GothamRegistration {
  name: string
  email: string
  option: 'primaner' | 'externe'
}
