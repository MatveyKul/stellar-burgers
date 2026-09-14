import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getFeedsApi,
  getOrdersApi,
  getOrderByNumberApi
} from '../../utils/burger-api';
import type { TOrder } from '../../utils/types';

type TOrdersState = {
  orders: TOrder[];
  profileOrders: TOrder[];
  orderInfo: TOrder | null;
  total: number;
  totalToday: number;
  isOrdersLoading: boolean;
  isProfileOrdersLoading: boolean;
  isOrderInfoLoading: boolean;
  error: string | null;
};

const initialState: TOrdersState = {
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

export const fetchFeeds = createAsyncThunk('orders/fetchFeeds', async () =>
  getFeedsApi()
);

export const fetchProfileOrders = createAsyncThunk(
  'orders/fetchProfileOrders',
  async () => getOrdersApi()
);

export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchOrderByNumber',
  async (number: number) => getOrderByNumberApi(number)
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderInfo: (state) => {
      state.orderInfo = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isOrdersLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isOrdersLoading = false;
        state.error = action.error.message ?? 'Ошибка загрузки ленты заказов';
      })
      .addCase(fetchProfileOrders.pending, (state) => {
        state.isProfileOrdersLoading = true;
        state.error = null;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.isProfileOrdersLoading = false;
        state.profileOrders = action.payload;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.isProfileOrdersLoading = false;
        state.error = action.error.message ?? 'Ошибка загрузки истории заказов';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isOrderInfoLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isOrderInfoLoading = false;
        state.orderInfo = action.payload.orders[0] ?? null;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isOrderInfoLoading = false;
        state.error = action.error.message ?? 'Ошибка загрузки заказа';
      });
  }
});

export const { clearOrderInfo } = ordersSlice.actions;
export const ordersReducer = ordersSlice.reducer;
