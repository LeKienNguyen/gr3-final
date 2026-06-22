export const STOCK_STATUS = {
  IN_STOCK: 'in_stock',
  LOW_STOCK: 'low_stock',
  OUT_OF_STOCK: 'out_of_stock',
};

export const STOCK_STATUS_LABELS = {
  [STOCK_STATUS.IN_STOCK]: 'In Stock',
  [STOCK_STATUS.LOW_STOCK]: 'Low Stock',
  [STOCK_STATUS.OUT_OF_STOCK]: 'Out of Stock',
};

export const MOVEMENT_TYPES = {
  IN: 'in',
  OUT: 'out',
  ADJUSTMENT: 'adjustment',
  WASTE: 'waste',
};

export const UNITS = {
  KG: 'kg',
  G: 'g',
  L: 'l',
  ML: 'ml',
  PCS: 'pcs',
  PACK: 'pack',
};

export const LOW_STOCK_THRESHOLD = 10;
