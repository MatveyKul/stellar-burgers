import { FC, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrderByNumber } from '../../services/orders/slice';
import {
  selectIngredients,
  selectOrderInfo,
  selectOrderInfoLoading,
  selectOrders,
  selectProfileOrders
} from '../../services/selectors';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();
  const fetchAttemptedRef = useRef(false);

  const feedsOrders = useSelector(selectOrders);
  const profileOrderList = useSelector(selectProfileOrders);
  const orderInfo = useSelector(selectOrderInfo);
  const isOrderInfoLoading = useSelector(selectOrderInfoLoading);
  const ingredients = useSelector(selectIngredients);

  const orderNumber = Number(number);

  const orderFromFeeds = feedsOrders.find(
    (order) => order.number === orderNumber
  );
  const orderFromProfile = profileOrderList.find(
    (order) => order.number === orderNumber
  );
  const orderFromStore = orderInfo?.number === orderNumber ? orderInfo : null;

  const orderData = orderFromFeeds || orderFromProfile || orderFromStore;

  useEffect(() => {
    if (!orderData && !isOrderInfoLoading && !fetchAttemptedRef.current) {
      fetchAttemptedRef.current = true;
      dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [dispatch, orderNumber, orderData, isOrderInfoLoading]);

  const orderInfoProcessed = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfoProcessed) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfoProcessed} />;
};
