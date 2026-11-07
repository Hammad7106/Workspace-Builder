import { ACCESSORIES, CHAIRS, DESKS, type ProductId } from './products'
import type { Category, Product } from './types'

/** Category tabs, in display order. */
export const CATEGORIES = [
  { id: 'desk', label: 'Desks' },
  { id: 'chair', label: 'Chairs' },
  { id: 'accessory', label: 'Accessories' },
] as const satisfies readonly { id: Category; label: string }[]

/** Every rentable product, in display order. */
export const PRODUCTS: readonly Product[] = [...DESKS, ...CHAIRS, ...ACCESSORIES]

const productsById = new Map<string, Product>(PRODUCTS.map((product) => [product.id, product]))

/** Type guard for ids that come from untrusted input (URL params, localStorage). */
export function isProductId(id: string): id is ProductId {
  return productsById.has(id)
}

/** Looks up a product by a known-valid id. */
export function getProduct(id: ProductId): Product {
  // Every ProductId is derived from the catalog arrays, so the lookup cannot miss.
  return productsById.get(id)!
}

/** All products in a category, in display order. */
export function getProductsByCategory<C extends Category>(
  category: C,
): Extract<Product, { category: C }>[] {
  return PRODUCTS.filter(
    (product): product is Extract<Product, { category: C }> => product.category === category,
  )
}
