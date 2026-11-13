import type { RootState } from '../store';
import * as selectors from '../selectors';
import { bun, createOrder, main, user } from './fixtures';

const feedOrder = createOrder({
  _id: 'feed-order-1',
  number: 101,
  name: 'Заказ ленты 1'
});
const secondFeedOrder = createOrder({
  _id: 'feed-order-2',
  number: 102,
  name: 'Заказ ленты 2'
});
const profileOrder = createOrder({
  _id: 'profile-order-1',
  number: 201,
  name: 'Заказ истории'
});
const orderInfo = createOrder({
  _id: 'order-info-1',
  number: 301,
  name: 'Детали заказа'
});
const currentOrder = createOrder({
  _id: 'current-order-1',
  number: 401,
  name: 'Оформляемый заказ'
});

const state: RootState = {
  ingredients: {
    ingredients: [bun, main],
    isIngredientsLoading: true,
    error: 'Ошибка ингредиентов'
  },
  burgerConstructor: {
    bun,
    ingredients: [{ ...main, id: 'main-1' }]
  },
  user: {
    user,
    isAuthChecked: true,
    isLoading: true,
    error: 'Ошибка пользователя'
  },
  orders: {
    orders: [feedOrder, secondFeedOrder],
    profileOrders: [profileOrder],
    orderInfo,
    total: 100,
    totalToday: 10,
    isOrdersLoading: true,
    isProfileOrdersLoading: false,
    isOrderInfoLoading: false,
    error: 'Ошибка заказов'
  },
  order: {
    order: currentOrder,
    orderRequest: true,
    error: 'Ошибка заказа'
  }
};

const withLoadingFlags = (
  isOrdersLoading: boolean,
  isProfileOrdersLoading: boolean,
  isOrderInfoLoading: boolean
): RootState => ({
  ...state,
  orders: {
    ...state.orders,
    isOrdersLoading,
    isProfileOrdersLoading,
    isOrderInfoLoading
  }
});

describe('selectors', () => {
  test('селекторы ингредиентов', () => {
    expect(selectors.selectIngredients(state)).toEqual([bun, main]);
    expect(selectors.selectIngredientsLoading(state)).toBe(true);
    expect(selectors.selectIngredientsError(state)).toBe('Ошибка ингредиентов');
  });

  test('селектор конструктора', () => {
    expect(selectors.selectConstructorItems(state)).toEqual(
      state.burgerConstructor
    );
  });

  test('селекторы пользователя', () => {
    expect(selectors.selectUser(state)).toEqual(user);
    expect(selectors.selectIsAuthChecked(state)).toBe(true);
    expect(selectors.selectUserError(state)).toBe('Ошибка пользователя');
    expect(selectors.selectUserLoading(state)).toBe(true);
  });

  test('селекторы заказов возвращают данные из своих полей', () => {
    expect(selectors.selectOrders(state)).toEqual([feedOrder, secondFeedOrder]);
    expect(selectors.selectProfileOrders(state)).toEqual([profileOrder]);
    expect(selectors.selectOrderInfo(state)).toEqual(orderInfo);
    expect(selectors.selectTotal(state)).toBe(100);
    expect(selectors.selectTotalToday(state)).toBe(10);
    expect(selectors.selectOrdersError(state)).toBe('Ошибка заказов');
  });

  test('селекторы загрузки заказов читают собственные флаги', () => {
    const ordersLoadingState = withLoadingFlags(true, false, false);
    expect(selectors.selectOrdersLoading(ordersLoadingState)).toBe(true);
    expect(selectors.selectProfileOrdersLoading(ordersLoadingState)).toBe(
      false
    );
    expect(selectors.selectOrderInfoLoading(ordersLoadingState)).toBe(false);

    const profileOrdersLoadingState = withLoadingFlags(false, true, false);
    expect(selectors.selectOrdersLoading(profileOrdersLoadingState)).toBe(
      false
    );
    expect(
      selectors.selectProfileOrdersLoading(profileOrdersLoadingState)
    ).toBe(true);
    expect(selectors.selectOrderInfoLoading(profileOrdersLoadingState)).toBe(
      false
    );

    const orderInfoLoadingState = withLoadingFlags(false, false, true);
    expect(selectors.selectOrdersLoading(orderInfoLoadingState)).toBe(false);
    expect(selectors.selectProfileOrdersLoading(orderInfoLoadingState)).toBe(
      false
    );
    expect(selectors.selectOrderInfoLoading(orderInfoLoadingState)).toBe(true);
  });

  test('селекторы оформляемого заказа', () => {
    expect(selectors.selectOrderRequest(state)).toBe(true);
    expect(selectors.selectOrderModalData(state)).toEqual(currentOrder);
    expect(selectors.selectOrderError(state)).toBe('Ошибка заказа');
  });
});
