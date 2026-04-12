import type { Product, ProductColor } from '../types/product'

export const COLOR_MAP: Record<ProductColor, string> = {
  Rouge: '#C41E3A',
  Noir: '#1A1A1A',
  Gris: '#9E9E9E',
  Vert: '#2D6A4F',
}

export const PRODUCT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const

export const PRODUCTS: Product[] = [
  {
    id: 'hoodie',
    name: 'Hoodie',
    category: 'hoodie',
    price: 50,
    colors: ['Rouge', 'Noir', 'Gris', 'Vert'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Pullover avec capuche — LMRL Primaner',
  },
  {
    id: 'crewneck',
    name: 'Crewneck',
    category: 'crewneck',
    price: 50,
    colors: ['Rouge', 'Noir', 'Gris', 'Vert'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Pullover sans capuche — LMRL Primaner',
  },
  {
    id: 'zip-hoodie',
    name: 'Zip Hoodie',
    category: 'zip-hoodie',
    price: 55,
    colors: ['Rouge', 'Noir', 'Gris', 'Vert'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Zipper avec capuche — LMRL Primaner',
  },
  {
    id: 't-shirt',
    name: 'T-Shirt',
    category: 't-shirt',
    price: 25,
    colors: ['Rouge', 'Noir', 'Gris', 'Vert'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'T-shirt unisexe — LMRL Primaner',
  },
  {
    id: 'tote-bag',
    name: 'Tote Bag',
    category: 'tote-bag',
    price: null,
    colors: ['Noir'],
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
