import type { Category } from '@/features/catalog'

/** Matching ids for a tab and its panel, so aria-controls / aria-labelledby line up. */
export const tabId = (prefix: string, category: Category) => `${prefix}-tab-${category}`
export const panelId = (prefix: string, category: Category) => `${prefix}-panel-${category}`
