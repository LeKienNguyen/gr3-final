export * from './roles';
export * from './inventory';
export * from './orders';
export * from './navigation';

export const APP_NAME = 'BBQ Restaurant Manager';

export const COLLECTIONS = {
  USERS: 'users',
  INGREDIENTS: 'ingredients',
  STOCK_MOVEMENTS: 'stockMovements',
  SUPPLIERS: 'suppliers',
  ORDERS: 'orders',
  SALES: 'sales',
  FEEDBACK: 'feedback',
  EMPLOYEES: 'employees',
  FORECASTS: 'forecasts',
  SETTINGS: 'settings',
  ATTENDANCE: 'attendance',
  SCHEDULES: 'schedules',
  CHECKLISTS: 'checklists',
  ACTIVITIES: 'activities',
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};
