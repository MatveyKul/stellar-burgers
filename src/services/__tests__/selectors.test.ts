import type { RootState } from '../store';
import * as selectors from '../selectors';
import { bun, createOrder, main, user } from './fixtures';

const order = createOrder();

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
    orders: [order],
    profileOrders: [order],
    orderInfo: order,
    total: 100,
    totalToday: 10,
    isOrdersLoading: true,
    isProfileOrdersLoading: true,
    isOrderInfoLoading: true,
    error: 'Ошибка заказов'
  },
  order: {
    order,
    orderRequest: true,
    error: 'Ошибка заказа'
  }
};

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

  test('селекторы заказов', () => {
    expect(selectors.selectOrders(state)).toEqual([order]);
    expect(selectors.selectProfileOrders(state)).toEqual([order]);
    expect(selectors.selectOrderInfo(state)).toEqual(order);
    expect(selectors.selectOrdersLoading(state)).toBe(true);
    expect(selectors.selectProfileOrdersLoading(state)).toBe(true);
    expect(selectors.selectOrderInfoLoading(state)).toBe(true);
    expect(selectors.selectTotal(state)).toBe(100);
    expect(selectors.selectTotalToday(state)).toBe(10);
    expect(selectors.selectOrdersError(state)).toBe('Ошибка заказов');
  });

  test('селекторы оформляемого заказа', () => {
    expect(selectors.selectOrderRequest(state)).toBe(true);
    expect(selectors.selectOrderModalData(state)).toEqual(order);
    expect(selectors.selectOrderError(state)).toBe('Ошибка заказа');
  });
});
