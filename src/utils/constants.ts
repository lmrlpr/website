import type { Product, ProductColor } from '../types/product'

// ─── Product image map ───────────────────────────────────────────────────────
// Keys: productId → garment color → design number (1|2|3) → side (array = multiple photos)
// To add new photos: place file in public/merch/, then add its path here.
// Naming convention for new files: {productId}_{colorSlug}_design{N}_{front|back}.jpg
export const PRODUCT_IMAGES: Record<
  string,
  Partial<Record<ProductColor, Record<number, { front?: string[]; back?: string[] }>>>
> = {
  't-shirt': {
    Noir: {
      1: {
        front: ['/merch/Zoe_tshirt_black_open_1.webp'],
        back:  ['/merch/Zoe_tshirt_black_back_1.webp', '/merch/Lou_black_tshirt_back_1.webp'],
      },
    },
    Blanc: {
      2: {
        front: ['/merch/Lou_white_tshirt_2.webp', '/merch/Tabea_white_tshirt_2.webp'],
        back:  ['/merch/Lou_white_tshirt_back_2.webp', '/merch/Tabea_tshirt_white_back_2.webp'],
      },
    },
  },
  crewneck: {
    Gris: {
      1: {
        front: ['/merch/Lou_grey_crewneck_1.webp', '/merch/Tabea_grey_crewneck-1.webp'],
        back:  ['/merch/Lou_grey_cewneck_back_1.webp', '/merch/Tabe_grey_crewneck_back_1.webp'],
      },
    },
    Noir: {
      2: {
        front: ['/merch/Zoe_crewneck_black_2.webp', '/merch/Lou_cewneck_black_2.webp', '/merch/Lou_crewneck_black_2.webp'],
        back:  ['/merch/Lou_black_crewneck_back_2.webp'],
      },
    },
  },
  'tote-bag': {
    Beige: {
      1: { front: ['/merch/Tabea_totebag.webp'] },
      2: { front: ['/merch/Tabea_totebag_second_version.webp'] },
    },
  },
}

/** Exact model photos for a given product/color/design/side. No fallback. */
export function getProductImages(
  productId: string,
  color: ProductColor,
  design: number,
  side: 'front' | 'back',
): string[] {
  return PRODUCT_IMAGES[productId]?.[color]?.[design]?.[side] ?? []
}

/** First available model photos across all designs for a color+side, or []. */
export function getAllModelPhotos(
  productId: string,
  color: ProductColor,
  side: 'front' | 'back',
): string[] {
  const colorMap = PRODUCT_IMAGES[productId]?.[color]
  if (!colorMap) return []
  for (const photos of Object.values(colorMap)) {
    const arr = photos[side] ?? []
    if (arr.length > 0) return arr
  }
  return []
}

/** First photo for a given combination+side, or null. */
export function getProductImage(
  productId: string,
  color: ProductColor,
  design: number,
  side: 'front' | 'back',
): string | null {
  return getProductImages(productId, color, design, side)[0] ?? null
}

/** Returns true if any photo exists for the given product/color/design (exact match). */
export function hasProductImages(
  productId: string,
  color: ProductColor,
  design: number,
): boolean {
  const entry = PRODUCT_IMAGES[productId]?.[color]?.[design]
  return (entry?.front?.length ?? 0) > 0 || (entry?.back?.length ?? 0) > 0
}

/** Returns the first available front photo for a product (used as hero/card image). */
export function getHeroImage(productId: string): string | null {
  const productMap = PRODUCT_IMAGES[productId]
  if (!productMap) return null
  for (const colorMap of Object.values(productMap)) {
    for (const designMap of Object.values(colorMap)) {
      const f = designMap.front?.[0]
      if (f) return f
    }
  }
  return null
}

/** Returns any available photo for a product — used as fallback when exact match is missing. */
export function getFallbackImage(productId: string): string | null {
  return getHeroImage(productId)
}

export const COLOR_MAP: Record<ProductColor, string> = {
  Noir: '#1A1A1A',
  Blanc: '#F0EDE8',
  Gris: '#9E9E9E',
  'Bleu foncé': '#1E3A5F',
  'Vert foncé': '#1A3A2A',
  Orange: '#E87722',
  Rose: '#D44C8B',
  Bleu: '#2563EB',
  Vert: '#2D6A4F',
  Beige: '#EDE0C8',
}

// ─── /public/design artwork ───────────────────────────────────────────────────
// Files live in /public/design as WebP:
//   Design_{garmentToken}_{N}_{motifToken}_{front|back}.webp

const DESIGN_GARMENT_TOKEN: Record<ProductColor, string> = {
  Noir: 'black',
  Blanc: 'white',
  Gris: 'grey',
  'Bleu foncé': 'blue',
  'Vert foncé': 'green',
  Orange: 'orange',
  Rose: 'pink',
  Bleu: 'blue',
  Vert: 'green',
  Beige: 'beige',
}

const DESIGN_MOTIF_TOKEN: Record<ProductColor, string> = {
  Noir: 'black',
  Blanc: 'white',
  Gris: 'grey',
  'Bleu foncé': 'blue',
  'Vert foncé': 'green',
  Orange: 'orange',
  Rose: 'pink',
  Bleu: 'blue',
  Vert: 'green',
  Beige: 'beige',
}

const DESIGN_MISSING = new Set<string>([
  '/design/Design_green_3_white_back.webp',
])

/** Resolve an artwork image from /public/design for a (garment, motif, design, side) tuple.
 *  Returns null when the file is known to be missing. */
export function getDesignImage(
  garment: ProductColor,
  motif: ProductColor | null | undefined,
  design: number,
  side: 'front' | 'back',
): string | null {
  if (!motif) return null
  const g = DESIGN_GARMENT_TOKEN[garment]
  const m = DESIGN_MOTIF_TOKEN[motif]
  if (!g || !m) return null
  const path = `/design/Design_${g}_${design}_${m}_${side}.webp`
  if (DESIGN_MISSING.has(path)) return null
  return path
}

/** Resolve the design artwork URL for a combination (used for design thumbnails and previews).
 *  Does not include model photos — those are accessed via getAllModelPhotos. */
export function getPreviewImage(
  _productId: string,
  garment: ProductColor,
  motif: ProductColor | null | undefined,
  design: number,
  side: 'front' | 'back',
): string | null {
  return getDesignImage(garment, motif, design, side)
}

/** True if design artwork exists for this tuple. */
export function hasAnyPreview(
  productId: string,
  garment: ProductColor,
  motif: ProductColor | null | undefined,
  design: number,
  side: 'front' | 'back',
): boolean {
  return getPreviewImage(productId, garment, motif, design, side) !== null
}

export const PRODUCT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const

// Shared pairing matrix for Hoodie / Crewneck / Zipper — identical per spec.
const APPAREL_COLORS: ProductColor[] = ['Gris', 'Noir', 'Bleu foncé', 'Vert foncé', 'Blanc']
const APPAREL_MOTIFS: Partial<Record<ProductColor, ProductColor[]>> = {
  Gris:         ['Noir'],
  Noir:         ['Blanc', 'Orange', 'Rose'],
  'Bleu foncé': ['Blanc'],
  'Vert foncé': ['Blanc'],
  Blanc:        ['Noir'],
}

export const PRODUCTS: Product[] = [
  {
    id: 'crewneck',
    name: 'Crewneck',
    category: 'crewneck',
    price: 50,
    colors: APPAREL_COLORS,
    motifColors: APPAREL_MOTIFS,
    designs: ['Design 1', 'Design 2', 'Design 3'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Pullover sans capuche — LMRL Primaner',
  },
  {
    id: 'hoodie',
    name: 'Hoodie',
    category: 'hoodie',
    price: 50,
    colors: APPAREL_COLORS,
    motifColors: APPAREL_MOTIFS,
    designs: ['Design 1', 'Design 2', 'Design 3'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Pullover avec capuche — LMRL Primaner',
    heroImage: '/design/Hoodie_front.png',
  },
  {
    id: 'zip-hoodie',
    name: 'Zipper',
    category: 'zip-hoodie',
    price: 55,
    colors: APPAREL_COLORS,
    motifColors: APPAREL_MOTIFS,
    designs: ['Design 1', 'Design 2', 'Design 3'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Zipper avec capuche — LMRL Primaner',
    heroImage: '/design/Zipper_front.png',
  },
  {
    id: 't-shirt',
    name: 'T-Shirt',
    category: 't-shirt',
    price: 25,
    colors: ['Noir', 'Blanc', 'Gris'],
    motifColors: {
      Noir:  ['Blanc'],
      Blanc: ['Noir', 'Bleu', 'Orange'],
      Gris:  ['Noir'],
    },
    designs: ['Design 1', 'Design 2', 'Design 3'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'T-shirt unisexe — LMRL Primaner',
  },
  {
    id: 'tote-bag',
    name: 'Tote Bag',
    category: 'tote-bag',
    price: 15,
    colors: ['Beige'],
    motifColors: {
      Beige: ['Noir', 'Bleu', 'Vert', 'Rose'],
    },
    designs: ['Design 1', 'Design 2', 'Design 3'],
    description: 'Tote bag — LMRL Primaner',
  },
]

export const DRINK_SURCHARGE = 7

export const STARTERS = [
  { id: 'rigatoni-truffe', label: 'Mezzi Rigatoni à la crème de truffe et écailles de parmesan', vegan: false },
  { id: 'paccheri-burrata', label: 'Paccheri à la sauce tomate, burrata et basilic', vegan: false },
  { id: 'legumes-grilles', label: 'Assiette de légumes grillés', vegan: true },
  { id: 'burrata-med', label: 'Burrata à la méditerranéenne (courgettes et aubergines grillées, tomates séchées et pesto)', vegan: false },
]

export const MAINS = [
  { id: 'bar-plancha', label: 'Bar à la plancha, sauce au citron — pommes de terre au four et légumes', vegan: false },
  { id: 'escalope-veau', label: 'Escalope de veau, sauce au poivre — pommes de terre au four et légumes', vegan: false },
  { id: 'spaghetti-courgettes', label: 'Spaghetti de courgettes à la méditerranéenne', vegan: true },
  { id: 'pizza-buffala', label: 'Pizza Buffala', vegan: false },
  { id: 'pizza-prosciutto', label: 'Pizza Prosciutto e Funghi', vegan: false },
  { id: 'pizza-diavola', label: 'Pizza Diavola', vegan: false },
]

export const DESSERTS = [
  { id: 'tiramisu', label: 'Tiramisu', vegan: false },
  { id: 'panna-cotta', label: 'Panna cotta aux fruits rouges', vegan: false },
  { id: 'macedoine', label: 'Macédoine de fruits', vegan: true },
]
