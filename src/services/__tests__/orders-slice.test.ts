import { configureStore } from '@reduxjs/toolkit';
import {
  ordersReducer,
  fetchFeeds,
  fetchProfileOrders,
  fetchOrderByNumber,
  clearOrderInfo
} from '../orders/slice';
import {
  getFeedsApi,
  getOrdersApi,
  getOrderByNumberApi
} from '../../utils/burger-api';
import { createOrder, pending } from './fixtures';

jest.mock('../../utils/burger-api');

const mockedGetFeedsApi = getFeedsApi as jest.MockedFunction<
  typeof getFeedsApi
>;
const mockedGetOrdersApi = getOrdersApi as jest.MockedFunction<
  typeof getOrdersApi
>;
const mockedGetOrderByNumberApi = getOrderByNumberApi as jest.MockedFunction<
  typeof getOrderByNumberApi
>;

const createTestStore = () =>
  configureStore({ reducer: { orders: ordersReducer } });

const getState = (store: ReturnType<typeof createTestStore>) =>
  store.getState().orders;

const order = createOrder({ _id: 'order-1', number: 101 });
const secondOrder = createOrder({ _id: 'order-2', number: 102 });

const initialState = {
  orders: [],
  profileOrders: [],
  orderInfo: null,
  total: 0,
  totalToday: 0,
  isOrdersLoading: false,
  isProfileOrdersLoading: false,
  isOrderInfoLoading: false,
  error: null
};

describe('orders slice', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('возвращает начальное состояние', () => {
    const store = createTestStore();

    expect(getState(store)).toEqual(initialState);
  });

  describe('fetchFeeds', () => {
    test('переводит состояние в pending', () => {
      mockedGetFeedsApi.mockReturnValue(pending());

      const store = createTestStore();
      store.dispatch(fetchFeeds());

      expect(getState(store).isOrdersLoading).toBe(true);
      expect(getState(store).error).toBeNull();
    });

    test('сохраняет ленту заказов при fulfilled', async () => {
      mockedGetFeedsApi.mockResolvedValue({
        success: true,
        orders: [order, secondOrder],
        total: 250,
        totalToday: 25
      });

      const store = createTestStore();
      await store.dispatch(fetchFeeds());

      expect(getState(store)).toMatchObject({
        orders: [order, secondOrder],
        total: 250,
        totalToday: 25,
        isOrdersLoading: false,
        error: null
      });
    });

    test('сохраняет ошибку при rejected', async () => {
      mockedGetFeedsApi.mockRejectedValue(new Error('Ошибка ленты заказов'));

      const store = createTestStore();
      await store.dispatch(fetchFeeds()).catch(() => undefined);

      expect(getState(store).isOrdersLoading).toBe(false);
      expect(getState(store).error).toBe('Ошибка ленты заказов');
    });
  });

  describe('fetchProfileOrders', () => {
    test('переводит состояние в pending', () => {
      mockedGetOrdersApi.mockReturnValue(pending());

      const store = createTestStore();
      store.dispatch(fetchProfileOrders());

      expect(getState(store).isProfileOrdersLoading).toBe(true);
      expect(getState(store).error).toBeNull();
    });

    test('сохраняет историю заказов при fulfilled', async () => {
      mockedGetOrdersApi.mockResolvedValue([order]);

      const store = createTestStore();
      await store.dispatch(fetchProfileOrders());

      expect(getState(store).profileOrders).toEqual([order]);
      expect(getState(store).isProfileOrdersLoading).toBe(false);
      expect(getState(store).error).toBeNull();
    });

    test('сохраняет ошибку при rejected', async () => {
      mockedGetOrdersApi.mockRejectedValue(new Error('Ошибка истории заказов'));

      const store = createTestStore();
      await store.dispatch(fetchProfileOrders()).catch(() => undefined);

      expect(getState(store).isProfileOrdersLoading).toBe(false);
      expect(getState(store).error).toBe('Ошибка истории заказов');
    });
  });

  describe('fetchOrderByNumber', () => {
    test('переводит состояние в pending', () => {
      mockedGetOrderByNumberApi.mockReturnValue(pending());

      const store = createTestStore();
      store.dispatch(fetchOrderByNumber(101));

      expect(getState(store).isOrderInfoLoading).toBe(true);
      expect(getState(store).error).toBeNull();
    });

    test('сохраняет заказ при fulfilled', async () => {
      mockedGetOrderByNumberApi.mockResolvedValue({
        success: true,
        orders: [order]
      });

      const store = createTestStore();
      await store.dispatch(fetchOrderByNumber(101));

      expect(mockedGetOrderByNumberApi).toHaveBeenCalledWith(101);
      expect(getState(store).orderInfo).toEqual(order);
      expect(getState(store).isOrderInfoLoading).toBe(false);
      expect(getState(store).error).toBeNull();
    });

    test('оставляет orderInfo пустым, если заказ не найден', async () => {
      mockedGetOrderByNumberApi.mockResolvedValue({
        success: true,
        orders: []
      });

      const store = createTestStore();
      await store.dispatch(fetchOrderByNumber(999));

      expect(getState(store).orderInfo).toBeNull();
    });

    test('сохраняет ошибку при rejected', async () => {
      mockedGetOrderByNumberApi.mockRejectedValue(new Error('Ошибка заказа'));

      const store = createTestStore();
      await store.dispatch(fetchOrderByNumber(101)).catch(() => undefined);

      expect(getState(store).isOrderInfoLoading).toBe(false);
      expect(getState(store).error).toBe('Ошибка заказа');
    });
  });

  test('clearOrderInfo очищает информацию о заказе', () => {
    const store = createTestStore();
    store.dispatch(
      fetchOrderByNumber.fulfilled(
        { success: true, orders: [order] },
        'request-id',
        101
      )
    );

    store.dispatch(clearOrderInfo());

    expect(getState(store).orderInfo).toBeNull();
  });
});
