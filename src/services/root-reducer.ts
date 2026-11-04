import { combineReducers } from '@reduxjs/toolkit';

import { ingredientsReducer } from './ingredients/slice';
import { constructorReducer } from './constructor/slice';
import { userReducer } from './user/slice';
import { ordersReducer } from './orders/slice';
import { orderReducer } from './order/slice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  user: userReducer,
  orders: ordersReducer,
  order: orderReducer
});
