import type { CatalogProduct, Product } from '@/features/catalog'
import { ProductArt } from '@/features/preview/ProductArt'

const TILE_STYLES: Record<Product['category'], string> = {
  desk: 'bg-sand-200',
  chair: 'bg-jungle-100',
  accessory: 'bg-sunset-100',
}

/** The product's scene illustration on a tinted tile, so cards match what appears in the preview. */
export function ProductThumbnail({ product }: { product: CatalogProduct }) {
  return (
    <span className={`grid size-14 shrink-0 place-items-center rounded-2xl ${TILE_STYLES[product.category]}`}>
      <ProductArt id={product.id} className="size-12" />
    </span>
  )
}
