import { configureStore } from '@reduxjs/toolkit';
import { orderReducer, createOrder, resetOrder } from '../order/slice';
import { orderBurgerApi } from '../../utils/burger-api';
import { createOrder as createOrderFixture, pending } from './fixtures';

jest.mock('../../utils/burger-api');

const mockedOrderBurgerApi = orderBurgerApi as jest.MockedFunction<
  typeof orderBurgerApi
>;

const createTestStore = () =>
  configureStore({ reducer: { order: orderReducer } });

const getState = (store: ReturnType<typeof createTestStore>) =>
  store.getState().order;

const newOrderResponse = {
  success: true,
  name: 'Космический бургер',
  order: {
    _id: 'order-1',
    status: 'done',
    name: 'Космический бургер',
    owner: {
      name: 'Тестовый пользователь',
      email: 'test@stellar.ru',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    number: 42,
    price: 1455
  }
};

const initialState = {
  order: null,
  orderRequest: false,
  error: null
};

describe('order slice', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('возвращает начальное состояние', () => {
    const store = createTestStore();

    expect(getState(store)).toEqual(initialState);
  });

  test('createOrder переводит состояние в pending и сбрасывает заказ', () => {
    mockedOrderBurgerApi.mockReturnValue(pending());

    const store = createTestStore();
    store.dispatch(createOrder(['bun-1']));

    expect(getState(store)).toEqual({
      order: null,
      orderRequest: true,
      error: null
    });
  });

  test('createOrder сохраняет заказ при fulfilled', async () => {
    mockedOrderBurgerApi.mockResolvedValue(newOrderResponse);

    const ingredients = ['bun-1', 'main-1', 'bun-1'];
    const store = createTestStore();
    await store.dispatch(createOrder(ingredients));

    expect(mockedOrderBurgerApi).toHaveBeenCalledWith(ingredients);
    expect(getState(store)).toEqual({
      order: { ...newOrderResponse.order, ingredients },
      orderRequest: false,
      error: null
    });
  });

  test('createOrder сохраняет ошибку при rejected', async () => {
    mockedOrderBurgerApi.mockRejectedValue(
      new Error('Ошибка оформления заказа')
    );

    const store = createTestStore();
    await store.dispatch(createOrder(['bun-1'])).catch(() => undefined);

    expect(getState(store)).toEqual({
      order: null,
      orderRequest: false,
      error: 'Ошибка оформления заказа'
    });
  });

  test('resetOrder сбрасывает состояние', () => {
    const store = createTestStore();
    store.dispatch(
      createOrder.fulfilled(createOrderFixture({ number: 42 }), 'request-id', [
        'bun-1'
      ])
    );

    store.dispatch(resetOrder());

    expect(getState(store)).toEqual(initialState);
  });
});
