export const ORDER_STATUS = {
  PENDING: 'pending',
  PREPARING: 'preparing',
  READY: 'ready',
  SERVED: 'served',
  CANCELLED: 'cancelled',
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Pending',
  [ORDER_STATUS.PREPARING]: 'Preparing',
  [ORDER_STATUS.READY]: 'Ready',
  [ORDER_STATUS.SERVED]: 'Served',
  [ORDER_STATUS.CANCELLED]: 'Cancelled',
};

export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  TRANSFER: 'transfer',
};
