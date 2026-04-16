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
      2: { front: ['/merch/design_front_2.webp'], back: ['/merch/design_2_back.webp'] },
      3: { front: ['/merch/design_3_front.webp'], back: ['/merch/design_3_back.webp'] },
    },
    Blanc: {
      1: { front: ['/merch/design_1_front.webp'], back: ['/merch/design_1_back.webp'] },
      2: {
        front: ['/merch/Lou_white_tshirt_2.webp', '/merch/Tabea_white_tshirt_2.webp'],
        back:  ['/merch/Lou_white_tshirt_back_2.webp', '/merch/Tabea_tshirt_white_back_2.webp'],
      },
      3: { front: ['/merch/design_3_front.webp'], back: ['/merch/design_3_back.webp'] },
    },
    Gris: {
      1: { front: ['/merch/design_1_front.webp'], back: ['/merch/design_1_back.webp'] },
      2: { front: ['/merch/design_front_2.webp'], back: ['/merch/design_2_back.webp'] },
      3: { front: ['/merch/design_3_front.webp'], back: ['/merch/design_3_back.webp'] },
    },
  },
  crewneck: {
    Gris: {
      1: {
        front: ['/merch/Lou_grey_crewneck_1.webp', '/merch/Tabea_grey_crewneck-1.webp'],
        back:  ['/merch/Lou_grey_cewneck_back_1.webp', '/merch/Tabe_grey_crewneck_back_1.webp'],
      },
      2: {
        front: ['/merch/design_front_2.webp'],
        back:  ['/merch/design_2_back.webp'],
      },
      3: {
        front: ['/merch/design_3_front.webp'],
        back:  ['/merch/design_3_back.webp'],
      },
    },
    Noir: {
      1: {
        front: ['/merch/design_1_front.webp'],
        back:  ['/merch/design_1_back.webp'],
      },
      2: {
        front: ['/merch/Zoe_crewneck_black_2.webp', '/merch/Lou_cewneck_black_2.webp', '/merch/Lou_crewneck_black_2.webp'],
        back:  ['/merch/Lou_black_crewneck_back_2.webp'],
      },
    },
  },
  // Hoodie and Zip Hoodie share the same design flat-lay shots as Crewneck, for all colors
  hoodie: {
    Gris:  {
      1: { front: ['/merch/design_1_front.webp'], back: ['/merch/design_1_back.webp'] },
      2: { front: ['/merch/design_front_2.webp'], back: ['/merch/design_2_back.webp'] },
      3: { front: ['/merch/design_3_front.webp'], back: ['/merch/design_3_back.webp'] },
    },
    Noir:  {
      1: { front: ['/merch/design_1_front.webp'], back: ['/merch/design_1_back.webp'] },
      2: { front: ['/merch/design_front_2.webp'], back: ['/merch/design_2_back.webp'] },
      3: { front: ['/merch/design_3_front.webp'], back: ['/merch/design_3_back.webp'] },
    },
    Blanc: {
      1: { front: ['/merch/design_1_front.webp'], back: ['/merch/design_1_back.webp'] },
      2: { front: ['/merch/design_front_2.webp'], back: ['/merch/design_2_back.webp'] },
      3: { front: ['/merch/design_3_front.webp'], back: ['/merch/design_3_back.webp'] },
    },
  },
  'zip-hoodie': {
    Gris:  {
      1: { front: ['/merch/design_1_front.webp'], back: ['/merch/design_1_back.webp'] },
      2: { front: ['/merch/design_front_2.webp'], back: ['/merch/design_2_back.webp'] },
      3: { front: ['/merch/design_3_front.webp'], back: ['/merch/design_3_back.webp'] },
    },
    Noir:  {
      1: { front: ['/merch/design_1_front.webp'], back: ['/merch/design_1_back.webp'] },
      2: { front: ['/merch/design_front_2.webp'], back: ['/merch/design_2_back.webp'] },
      3: { front: ['/merch/design_3_front.webp'], back: ['/merch/design_3_back.webp'] },
    },
    Blanc: {
      1: { front: ['/merch/design_1_front.webp'], back: ['/merch/design_1_back.webp'] },
      2: { front: ['/merch/design_front_2.webp'], back: ['/merch/design_2_back.webp'] },
      3: { front: ['/merch/design_3_front.webp'], back: ['/merch/design_3_back.webp'] },
    },
  },
  'tote-bag': {
    Vert:  { 1: { front: ['/merch/Tabea_totebag.webp'] }, 2: { front: ['/merch/Tabea_totebag_second_version.webp'] } },
    Bleu:  { 1: { front: ['/merch/Tabea_totebag.webp'] }, 2: { front: ['/merch/Tabea_totebag_second_version.webp'] } },
    Noir:  { 1: { front: ['/merch/Tabea_totebag.webp'] }, 2: { front: ['/merch/Tabea_totebag_second_version.webp'] } },
    Rose:  { 1: { front: ['/merch/Tabea_totebag.webp'] }, 2: { front: ['/merch/Tabea_totebag_second_version.webp'] } },
  },
}

/** All photos for a given product/color/design/side.
 *  Falls back to design 1 of the same color when the exact design has no photos. */
export function getProductImages(
  productId: string,
  color: ProductColor,
  design: number,
  side: 'front' | 'back',
): string[] {
  const exact = PRODUCT_IMAGES[productId]?.[color]?.[design]?.[side] ?? []
  if (exact.length > 0) return exact
  // Fall back to design 1 of the same color
  if (design !== 1) {
    const d1 = PRODUCT_IMAGES[productId]?.[color]?.[1]?.[side] ?? []
    if (d1.length > 0) return d1
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

/** Returns true if any photo exists for the given product/color/design.
 *  Falls back to design 1 of the same color so all 3 designs appear available. */
export function hasProductImages(
  productId: string,
  color: ProductColor,
  design: number,
): boolean {
  const entry = PRODUCT_IMAGES[productId]?.[color]?.[design]
  if ((entry?.front?.length ?? 0) > 0 || (entry?.back?.length ?? 0) > 0) return true
  // Fall back to design 1 of the same color
  if (design !== 1) {
    const d1 = PRODUCT_IMAGES[productId]?.[color]?.[1]
    return !!((d1?.front?.length ?? 0) > 0 || (d1?.back?.length ?? 0) > 0)
  }
  return false
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

// ─── /public/design artwork fallback ─────────────────────────────────────────
// Files live in /public/design and follow the pattern:
//   Design_{garmentToken}_{N}_{motifToken}_{front|back}.jpeg
// A few filenames deviate (extra spaces or suffixes) — we list overrides below.

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

// Filenames that deviate from the canonical pattern (directory listing quirks).
// Key = canonical path; value = actual filename on disk.
const DESIGN_FILENAME_OVERRIDES: Record<string, string> = {
  '/design/Design_black_3_orange_front.jpeg': '/design/Design_black_3_orange _front.jpeg',
  '/design/Design_white_1_blue_front.jpeg':   '/design/Design_white_1_blue _front.jpeg',
  '/design/Design_white_2_blue_front.jpeg':   '/design/Design_white_2_blue _front.jpeg',
  '/design/Design_white_3_blue_front.jpeg':   '/design/Design_white_3_blue _front.jpeg',
}

// Known missing files (no artwork exists on disk).
const DESIGN_MISSING = new Set<string>([
  '/design/Design_green_3_white_back.jpeg',
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
  const canonical = `/design/Design_${g}_${design}_${m}_${side}.jpeg`
  if (DESIGN_MISSING.has(canonical)) return null
  return DESIGN_FILENAME_OVERRIDES[canonical] ?? canonical
}

/** Resolve the best preview URL for a combination:
 *  1) photoshoot photo (exact match)
 *  2) /public/design artwork
 *  3) null */
export function getPreviewImage(
  productId: string,
  garment: ProductColor,
  motif: ProductColor | null | undefined,
  design: number,
  side: 'front' | 'back',
): string | null {
  const photos = PRODUCT_IMAGES[productId]?.[garment]?.[design]?.[side] ?? []
  if (photos.length > 0) return photos[0]
  return getDesignImage(garment, motif, design, side)
}

/** True if either a photoshoot or /public/design artwork exists for this tuple. */
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
    id: 'hoodie',
    name: 'Hoodie',
    category: 'hoodie',
    price: 50,
    colors: APPAREL_COLORS,
    motifColors: APPAREL_MOTIFS,
    designs: ['Design 1', 'Design 2', 'Design 3'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Pullover avec capuche — LMRL Primaner',
  },
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
    id: 'zip-hoodie',
    name: 'Zip Hoodie',
    category: 'zip-hoodie',
    price: 55,
    colors: APPAREL_COLORS,
    motifColors: APPAREL_MOTIFS,
    designs: ['Design 1', 'Design 2', 'Design 3'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Zipper — LMRL Primaner',
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
