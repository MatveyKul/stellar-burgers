import type { TIngredient, TOrder, TUser } from '../../utils/types';

export const createIngredient = (
  overrides: Partial<TIngredient> = {}
): TIngredient => ({
  _id: 'ingredient-1',
  name: 'Ингредиент',
  type: 'main',
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 100,
  price: 100,
  image: 'image.png',
  image_mobile: 'image-mobile.png',
  image_large: 'image-large.png',
  ...overrides
});

export const bun = createIngredient({
  _id: 'bun-1',
  name: 'Булка',
  type: 'bun',
  price: 500
});

export const main = createIngredient({
  _id: 'main-1',
  name: 'Начинка',
  type: 'main',
  price: 200
});

export const sauce = createIngredient({
  _id: 'sauce-1',
  name: 'Соус',
  type: 'sauce',
  price: 50
});

export const user: TUser = {
  email: 'test@stellar.ru',
  name: 'Тестовый пользователь'
};

export const createOrder = (overrides: Partial<TOrder> = {}): TOrder => ({
  _id: 'order-1',
  status: 'done',
  name: 'Заказ',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  number: 1,
  ingredients: [],
  ...overrides
});

export const pending = <T>(): Promise<T> => new Promise<T>(() => {});
