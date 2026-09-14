import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { TIngredient } from '@utils-types';
import { BurgerIngredientUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { addIngredient } from '../../services/constructor/slice';
import { selectConstructorItems } from '../../services/selectors';

type TBurgerIngredientProps = {
  ingredient: TIngredient;
};

export const BurgerIngredient: FC<TBurgerIngredientProps> = ({
  ingredient
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const constructorItems = useSelector(selectConstructorItems);

  const count =
    ingredient.type === 'bun'
      ? constructorItems.bun?._id === ingredient._id
        ? 2
        : 0
      : constructorItems.ingredients.filter(
          (item) => item._id === ingredient._id
        ).length;

  const handleAdd = () => {
    dispatch(addIngredient(ingredient));
  };

  return (
    <BurgerIngredientUI
      ingredient={ingredient}
      count={count}
      locationState={{ background: location }}
      handleAdd={handleAdd}
    />
  );
};
