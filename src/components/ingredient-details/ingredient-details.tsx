import { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import {
  selectIngredients,
  selectIngredientsLoading
} from '../../services/selectors';
import { useSelector } from '../../services/store';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const ingredients = useSelector(selectIngredients);
  const isIngredientsLoading = useSelector(selectIngredientsLoading);

  const ingredientData = useMemo(
    () => ingredients.find((ingredient) => ingredient._id === id),
    [ingredients, id]
  );

  if (!ingredientData) {
    if (isIngredientsLoading) {
      return <Preloader />;
    }
    return null;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
