export type ProductColor = 'Rouge' | 'Noir' | 'Gris' | 'Vert'
export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'
export type ProductCategory = 'hoodie' | 'crewneck' | 'zip-hoodie' | 't-shirt' | 'tote-bag' | 'socks'

export interface Product {
  id: string
  name: string
  category: ProductCategory
  price: number | null
  colors: ProductColor[]
  sizes?: ProductSize[]
  description?: string
}

export interface CartItem {
  productId: string
  productName: string
  price: number
  color: ProductColor
  size?: ProductSize
  quantity: number
}
