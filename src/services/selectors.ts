import { RootState } from './store';

export const selectIngredients = (state: RootState) =>
  state.ingredients.ingredients;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.isIngredientsLoading;
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;

export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor;

export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;
export const selectUserError = (state: RootState) => state.user.error;
export const selectUserLoading = (state: RootState) => state.user.isLoading;

export const selectOrders = (state: RootState) => state.orders.orders;
export const selectProfileOrders = (state: RootState) =>
  state.orders.profileOrders;
export const selectOrderInfo = (state: RootState) => state.orders.orderInfo;
export const selectOrdersLoading = (state: RootState) =>
  state.orders.isOrdersLoading;
export const selectProfileOrdersLoading = (state: RootState) =>
  state.orders.isProfileOrdersLoading;
export const selectOrderInfoLoading = (state: RootState) =>
  state.orders.isOrderInfoLoading;
export const selectTotal = (state: RootState) => state.orders.total;
export const selectTotalToday = (state: RootState) => state.orders.totalToday;
export const selectOrdersError = (state: RootState) => state.orders.error;

export const selectOrderRequest = (state: RootState) =>
  state.order.orderRequest;
export const selectOrderModalData = (state: RootState) => state.order.order;
export const selectOrderError = (state: RootState) => state.order.error;
