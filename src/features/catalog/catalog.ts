import {
  ACCESSORIES,
  CHAIRS,
  DESKS,
  type AccessoryId,
  type CatalogAccessory,
  type CatalogChair,
  type CatalogDesk,
  type CatalogProduct,
  type ChairId,
  type DeskId,
  type ProductId,
} from './products'
import type { Category } from './types'

/** Category tabs, in display order. */
export const CATEGORIES = [
  { id: 'desk', label: 'Desks' },
  { id: 'chair', label: 'Chairs' },
  { id: 'accessory', label: 'Accessories' },
] as const satisfies readonly { id: Category; label: string }[]

/** Every rentable product, in display order. */
export const PRODUCTS: readonly CatalogProduct[] = [...DESKS, ...CHAIRS, ...ACCESSORIES]

const indexById = <T extends CatalogProduct>(products: readonly T[]) =>
  new Map<string, T>(products.map((product) => [product.id, product]))

const productsById = indexById(PRODUCTS)
const desksById = indexById<CatalogDesk>(DESKS)
const chairsById = indexById<CatalogChair>(CHAIRS)
const accessoriesById = indexById<CatalogAccessory>(ACCESSORIES)

/*
 * Type guards for ids that come from untrusted input (URL params, localStorage).
 * The `unknown` parameter lets callers pass parsed JSON straight in.
 */
export const isProductId = (id: unknown): id is ProductId =>
  typeof id === 'string' && productsById.has(id)
export const isDeskId = (id: unknown): id is DeskId => typeof id === 'string' && desksById.has(id)
export const isChairId = (id: unknown): id is ChairId => typeof id === 'string' && chairsById.has(id)
export const isAccessoryId = (id: unknown): id is AccessoryId =>
  typeof id === 'string' && accessoriesById.has(id)

/*
 * Lookups by known-valid id. Every id type is derived from the catalog arrays,
 * so these lookups cannot miss.
 */
export const getProduct = (id: ProductId): CatalogProduct => productsById.get(id)!
export const getDesk = (id: DeskId): CatalogDesk => desksById.get(id)!
export const getChair = (id: ChairId): CatalogChair => chairsById.get(id)!
export const getAccessory = (id: AccessoryId): CatalogAccessory => accessoriesById.get(id)!

/** All products in a category, in display order. */
export function getProductsByCategory<C extends Category>(
  category: C,
): Extract<CatalogProduct, { category: C }>[] {
  return PRODUCTS.filter(
    (product): product is Extract<CatalogProduct, { category: C }> => product.category === category,
  )
}
