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

  describe('ingredientsReducer: неизвестный экшен', () => {
    test('возвращает начальное состояние при вызове с неизвестным экшеном', () => {
      expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual(
        initialState
      );
    });

    test('не изменяет подготовленное состояние при неизвестном экшене', () => {
      const state = {
        ingredients: [bun],
        isIngredientsLoading: true,
        error: 'Старая ошибка'
      };

      expect(ingredientsReducer(state, { type: 'UNKNOWN' })).toEqual(state);
    });
  });

  describe('ingredientsReducer: fetchIngredients.pending', () => {
    test('включает загрузку и сбрасывает ошибку', () => {
      const state = {
        ingredients: [bun],
        isIngredientsLoading: false,
        error: 'Старая ошибка'
      };

      const nextState = ingredientsReducer(
        state,
        fetchIngredients.pending('request-id')
      );

      expect(nextState).toEqual({
        ingredients: [bun],
        isIngredientsLoading: true,
        error: null
      });
    });
  });

  describe('ingredientsReducer: fetchIngredients.fulfilled', () => {
    test('сохраняет ингредиенты и выключает загрузку', () => {
      const ingredients = [bun, main];
      const state = {
        ingredients: [],
        isIngredientsLoading: true,
        error: null
      };

      const nextState = ingredientsReducer(
        state,
        fetchIngredients.fulfilled(ingredients, 'request-id')
      );

      expect(nextState).toEqual({
        ingredients,
        isIngredientsLoading: false,
        error: null
      });
    });
  });

  describe('ingredientsReducer: fetchIngredients.rejected', () => {
    test('сохраняет ошибку и выключает загрузку', () => {
      const state = {
        ingredients: [],
        isIngredientsLoading: true,
        error: null
      };

      const nextState = ingredientsReducer(
        state,
        fetchIngredients.rejected(
          new Error('Ошибка загрузки ингредиентов'),
          'request-id'
        )
      );

      expect(nextState).toEqual({
        ingredients: [],
        isIngredientsLoading: false,
        error: 'Ошибка загрузки ингредиентов'
      });
    });
  });

  describe('интеграционные тесты через store', () => {
    test('возвращает начальное состояние', () => {
      const store = createTestStore();

      expect(getState(store)).toEqual(initialState);
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
});
