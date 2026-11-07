import {
  Armchair,
  Headphones,
  Keyboard,
  LampDesk,
  Laptop,
  Monitor,
  Sprout,
  type LucideIcon,
  type LucideProps,
} from 'lucide-react'
import type { AccessorySlot, Product } from '@/features/catalog'

/** A simple standing-desk glyph in lucide's style (lucide has no desk icon). */
function DeskIcon(props: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 8h18" />
      <path d="M6 8v12M18 8v12" />
      <path d="M4 20h4M16 20h4" />
      <path d="M6 13h12" />
    </svg>
  )
}

const SLOT_ICONS: Record<AccessorySlot, LucideIcon> = {
  monitor: Monitor,
  lamp: LampDesk,
  'laptop-stand': Laptop,
  keyboard: Keyboard,
  headphones: Headphones,
  plant: Sprout,
}

const TILE_STYLES: Record<Product['category'], string> = {
  desk: 'bg-sand-200 text-ink-900',
  chair: 'bg-jungle-100 text-jungle-900',
  accessory: 'bg-sunset-100 text-sunset-600',
}

/**
 * Category icon on a tinted tile. A stand-in until the scene illustrations
 * (next batch) can be reused as product thumbnails.
 */
export function ProductThumbnail({ product }: { product: Product }) {
  const Icon =
    product.category === 'desk' ? DeskIcon : product.category === 'chair' ? Armchair : SLOT_ICONS[product.slot]

  return (
    <span className={`grid size-14 shrink-0 place-items-center rounded-2xl ${TILE_STYLES[product.category]}`}>
      <Icon className="size-7" aria-hidden />
    </span>
  )
}
