import type { Accessory, Chair, Desk } from './types'

/*
 * Product catalog.
 *
 * Products and categories mirror what monis.rent offers (adjustable desks, ergonomic
 * chairs, monitors, lamps, accessories). Prices are illustrative: they are calibrated
 * to the site's published "from" prices (furniture from $3/week, monitors from $5/week,
 * accessories from $0.50/week) and its ~30–40% monthly saving. Swap this file for
 * the live catalog API when one is available.
 *
 * `as const satisfies` keeps every `id` as a string literal, so `ProductId` is an exact
 * union and lookups (e.g. the preview's per-product artwork) are checked at compile time.
 */

export const DESKS = [
  {
    id: 'desk-mechanical',
    category: 'desk',
    name: 'Mechanical Adjustable Desk',
    description: 'A sturdy hand-crank desk that switches between sitting and standing.',
    highlights: ['Hand-crank height adjust', '120 × 60 cm top', 'Fits 2 monitors'],
    price: { week: 300, month: 900 },
    size: { widthCm: 120, depthCm: 60 },
    monitorCapacity: 2,
  },
  {
    id: 'desk-electric',
    category: 'desk',
    name: 'Electric Standing Desk',
    description: 'Stand up at the push of a button, with a quiet single motor.',
    highlights: ['Electric height adjust', '140 × 70 cm top', 'Fits 2 monitors'],
    price: { week: 500, month: 1450 },
    size: { widthCm: 140, depthCm: 70 },
    monitorCapacity: 2,
  },
  {
    id: 'desk-dual-motor',
    category: 'desk',
    name: 'Dual-Motor Standing Desk',
    description: 'A wide, rock-solid desk built for multi-monitor setups.',
    highlights: ['Dual motors, 120 kg load', '160 × 70 cm top', 'Fits 3 monitors'],
    price: { week: 700, month: 1900 },
    size: { widthCm: 160, depthCm: 70 },
    monitorCapacity: 3,
  },
] as const satisfies readonly Desk[]

export const CHAIRS = [
  {
    id: 'chair-task',
    category: 'chair',
    name: 'Essential Task Chair',
    description: 'A breathable mesh chair for focused work on a budget.',
    highlights: ['Breathable mesh back', 'Height adjustable', 'Smooth-rolling casters'],
    price: { week: 300, month: 800 },
  },
  {
    id: 'chair-ergonomic',
    category: 'chair',
    name: 'Ergonomic Office Chair',
    description: 'Full-day comfort with lumbar support and an adjustable headrest.',
    highlights: ['Adjustable lumbar support', 'Headrest + 4D armrests', 'Recline lock'],
    price: { week: 400, month: 1100 },
  },
  {
    id: 'chair-balance-stool',
    category: 'chair',
    name: 'Active Balance Stool',
    description: 'A wobble stool that keeps you moving, perfect next to a standing desk.',
    highlights: ['Active sitting', 'Pairs with standing desks', 'Compact footprint'],
    price: { week: 200, month: 550 },
  },
] as const satisfies readonly Chair[]

export const ACCESSORIES = [
  {
    id: 'monitor-24-fhd',
    category: 'accessory',
    slot: 'monitor',
    name: '24" Full HD Monitor',
    description: 'A crisp everyday screen for docs, code and calls.',
    highlights: ['1920 × 1080 IPS', 'HDMI + USB-C', 'Height-adjustable stand'],
    price: { week: 500, month: 1400 },
    maxQuantity: 3,
  },
  {
    id: 'monitor-27-4k',
    category: 'accessory',
    slot: 'monitor',
    name: '27" 4K Monitor',
    description: 'Sharp 4K detail for designers, editors and big spreadsheets.',
    highlights: ['3840 × 2160 IPS', 'USB-C power delivery', 'Colour-accurate panel'],
    price: { week: 800, month: 2200 },
    maxQuantity: 3,
  },
  {
    id: 'lamp-led',
    category: 'accessory',
    slot: 'lamp',
    name: 'Smart LED Desk Lamp',
    description: 'Warm-to-cool light for late sessions after sunset.',
    highlights: ['Adjustable colour temperature', 'Dimmable', 'Swivel arm'],
    price: { week: 150, month: 400 },
    maxQuantity: 1,
  },
  {
    id: 'laptop-stand',
    category: 'accessory',
    slot: 'laptop-stand',
    name: 'Aluminium Laptop Stand',
    description: 'Lifts your laptop to eye level and saves your neck.',
    highlights: ['Eye-level screen', 'Foldable', 'Fits 11–17" laptops'],
    price: { week: 100, month: 250 },
    maxQuantity: 1,
  },
  {
    id: 'keyboard-mouse',
    category: 'accessory',
    slot: 'keyboard',
    name: 'Wireless Keyboard & Mouse',
    description: 'A quiet, full-size combo that pairs with any laptop.',
    highlights: ['Bluetooth + USB receiver', 'Quiet keys', 'Rechargeable'],
    price: { week: 150, month: 400 },
    maxQuantity: 1,
  },
  {
    id: 'headphones-anc',
    category: 'accessory',
    slot: 'headphones',
    name: 'Noise-Cancelling Headphones',
    description: 'Block out scooters and roosters for deep-focus calls.',
    highlights: ['Active noise cancelling', '30 h battery', 'Built-in mic'],
    price: { week: 300, month: 800 },
    maxQuantity: 1,
  },
  {
    id: 'plant-monstera',
    category: 'accessory',
    slot: 'plant',
    name: 'Monstera Plant',
    description: 'A little bit of the jungle on your desk. We water it on delivery.',
    highlights: ['Live tropical plant', 'Ceramic pot', 'Low maintenance'],
    price: { week: 50, month: 150 },
    maxQuantity: 2,
  },
] as const satisfies readonly Accessory[]

export type DeskId = (typeof DESKS)[number]['id']
export type ChairId = (typeof CHAIRS)[number]['id']
export type AccessoryId = (typeof ACCESSORIES)[number]['id']
export type ProductId = DeskId | ChairId | AccessoryId

/** A product exactly as defined in the catalog, with its literal id (e.g. for artwork lookups). */
export type CatalogProduct = (typeof DESKS)[number] | (typeof CHAIRS)[number] | (typeof ACCESSORIES)[number]
