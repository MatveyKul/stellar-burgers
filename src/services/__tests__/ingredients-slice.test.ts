import { configureStore } from '@reduxjs/toolkit';
import { ingredientsReducer, fetchIngredients } from '../ingredients/slice';
import { getIngredientsApi } from '../../utils/burger-api';
import { bun, main, pending } from './fixtures';

jest.mock('../../utils/burger-api');

const mockedGetIngredientsApi = getIngredientsApi as jest.MockedFunction<
  typeof getIngredientsApi
>;

const createTestStore = () =>
  configureStore({ reducer: { ingredients: ingredientsReducer } });

const getState = (store: ReturnType<typeof createTestStore>) =>
  store.getState().ingredients;

const initialState = {
  ingredients: [],
  isIngredientsLoading: false,
  error: null
};

describe('ingredients slice', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('возвращает начальное состояние', () => {
    const store = createTestStore();

    expect(getState(store)).toEqual(initialState);
  });

  test('возвращает начальное состояние при вызове с неизвестным экшеном', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual(
      initialState
    );
  });

  test('fetchIngredients переводит состояние в pending', () => {
    mockedGetIngredientsApi.mockReturnValue(pending());

    const store = createTestStore();
    store.dispatch(fetchIngredients());

    expect(getState(store)).toEqual({
      ingredients: [],
      isIngredientsLoading: true,
      error: null
    });
  });

  test('fetchIngredients сохраняет ингредиенты при fulfilled', async () => {
    const ingredients = [bun, main];
    mockedGetIngredientsApi.mockResolvedValue(ingredients);

    const store = createTestStore();
    await store.dispatch(fetchIngredients());

    expect(getState(store)).toEqual({
      ingredients,
      isIngredientsLoading: false,
      error: null
    });
  });

  test('fetchIngredients сохраняет ошибку при rejected', async () => {
    mockedGetIngredientsApi.mockRejectedValue(
      new Error('Ошибка загрузки ингредиентов')
    );

    const store = createTestStore();
    await store.dispatch(fetchIngredients()).catch(() => undefined);

    expect(getState(store)).toEqual({
      ingredients: [],
      isIngredientsLoading: false,
      error: 'Ошибка загрузки ингредиентов'
    });
  });
});
