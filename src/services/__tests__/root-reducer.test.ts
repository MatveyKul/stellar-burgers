import { rootReducer } from '../root-reducer';
import { addIngredient, clearConstructor } from '../constructor/slice';
import { bun, main } from './fixtures';

describe('rootReducer', () => {
  test('возвращает начальное состояние хранилища', () => {
    expect(rootReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      ingredients: {
        ingredients: [],
        isIngredientsLoading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      user: {
        user: null,
        isAuthChecked: false,
        isLoading: false,
        error: null
      },
      orders: {
        orders: [],
        profileOrders: [],
        orderInfo: null,
        total: 0,
        totalToday: 0,
        isOrdersLoading: false,
        isProfileOrdersLoading: false,
        isOrderInfoLoading: false,
        error: null
      },
      order: {
        order: null,
        orderRequest: false,
        error: null
      }
    });
  });

  test('неизвестный экшен не изменяет состояние', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN' });

    expect(rootReducer(state, { type: 'SOMETHING_ELSE' })).toBe(state);
  });

  test('обрабатывает экшены конструктора через общий редьюсер', () => {
    let state = rootReducer(undefined, addIngredient(bun));
    state = rootReducer(state, addIngredient(main));

    expect(state.burgerConstructor.bun).toMatchObject(bun);
    expect(state.burgerConstructor.ingredients).toHaveLength(1);

    state = rootReducer(state, clearConstructor());

    expect(state.burgerConstructor).toEqual({ bun: null, ingredients: [] });
  });
});
