export type ProductColor = 'Noir' | 'Blanc' | 'Gris' | 'Bleu foncé' | 'Vert foncé' | 'Orange' | 'Rose' | 'Bleu' | 'Vert'
export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'
export type ProductCategory = 'hoodie' | 'crewneck' | 'zip-hoodie' | 't-shirt' | 'tote-bag' | 'socks'

export interface Product {
  id: string
  name: string
  category: ProductCategory
  price: number | null
  colors: ProductColor[]
  /** Maps garment color → available motif ink colors (3 motifs available per color) */
  motifColors?: Partial<Record<ProductColor, ProductColor[]>>
  /** Available design variants (different artworks), e.g. ['Design 1', 'Design 2', 'Design 3'] */
  designs?: string[]
  sizes?: ProductSize[]
  description?: string
}

export interface CartItem {
  productId: string
  productName: string
  price: number
  color: ProductColor
  motifColor?: ProductColor
  design?: string
  size?: ProductSize
  quantity: number
}
