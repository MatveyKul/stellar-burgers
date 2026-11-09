import {
  constructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../constructor/slice';
import { bun, main, sauce } from './fixtures';

describe('burgerConstructor slice', () => {
  test('возвращает начальное состояние при неизвестном экшене', () => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      bun: null,
      ingredients: []
    });
  });

  test('addIngredient добавляет булку', () => {
    const state = constructorReducer(undefined, addIngredient(bun));

    expect(state.bun).toMatchObject(bun);
    expect(state.bun).toHaveProperty('id', expect.any(String));
    expect(state.ingredients).toEqual([]);
  });

  test('addIngredient заменяет ранее выбранную булку', () => {
    const newBun = { ...bun, _id: 'bun-2', name: 'Другая булка' };

    const state = constructorReducer(
      constructorReducer(undefined, addIngredient(bun)),
      addIngredient(newBun)
    );

    expect(state.bun).toMatchObject(newBun);
    expect(state.ingredients).toEqual([]);
  });

  test('addIngredient добавляет ингредиент', () => {
    const state = constructorReducer(undefined, addIngredient(main));

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject(main);
    expect(state.ingredients[0].id).toEqual(expect.any(String));
  });

  test('addIngredient присваивает каждому ингредиенту уникальный id', () => {
    const state = constructorReducer(
      constructorReducer(undefined, addIngredient(main)),
      addIngredient(main)
    );

    expect(state.ingredients).toHaveLength(2);
    expect(state.ingredients[0].id).not.toBe(state.ingredients[1].id);
  });

  test('removeIngredient удаляет ингредиент по id', () => {
    const first = constructorReducer(undefined, addIngredient(main));
    const second = constructorReducer(first, addIngredient(sauce));
    const removedId = second.ingredients[0].id;

    const state = constructorReducer(second, removeIngredient(removedId));

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]._id).toBe(sauce._id);
  });

  test('removeIngredient не меняет состояние, если id не найден', () => {
    const state = constructorReducer(
      constructorReducer(undefined, addIngredient(main)),
      removeIngredient('unknown-id')
    );

    expect(state.ingredients).toHaveLength(1);
  });

  test('moveIngredient переставляет ингредиенты', () => {
    const first = { ...main, _id: 'main-1', name: 'Первый' };
    const second = { ...main, _id: 'main-2', name: 'Второй' };
    const third = { ...main, _id: 'main-3', name: 'Третий' };

    let state = constructorReducer(undefined, addIngredient(first));
    state = constructorReducer(state, addIngredient(second));
    state = constructorReducer(state, addIngredient(third));

    state = constructorReducer(state, moveIngredient({ from: 0, to: 2 }));

    expect(state.ingredients.map((item) => item.name)).toEqual([
      'Второй',
      'Третий',
      'Первый'
    ]);
  });

  test('clearConstructor сбрасывает конструктор', () => {
    let state = constructorReducer(undefined, addIngredient(bun));
    state = constructorReducer(state, addIngredient(main));

    state = constructorReducer(state, clearConstructor());

    expect(state).toEqual({ bun: null, ingredients: [] });
  });
});
