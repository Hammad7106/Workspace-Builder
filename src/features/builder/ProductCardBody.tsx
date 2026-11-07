import type { BillingPeriod, CatalogProduct } from '@/features/catalog'
import { PriceTag } from './PriceTag'
import { ProductThumbnail } from './ProductThumbnail'

/** The shared inside of every product card: thumbnail, name, pitch, highlights and price. */
export function ProductCardBody({ product, period }: { product: CatalogProduct; period: BillingPeriod }) {
  return (
    <span className="flex w-full items-start gap-3 text-left">
      <ProductThumbnail product={product} />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-ink-900">{product.name}</span>
        <span className="mt-0.5 block text-xs text-ink-600">{product.description}</span>
        <span className="mt-1.5 block text-[11px] font-medium text-ink-400">
          {product.highlights.join(' · ')}
        </span>
      </span>
      <PriceTag price={product.price} period={period} />
    </span>
  )
}
