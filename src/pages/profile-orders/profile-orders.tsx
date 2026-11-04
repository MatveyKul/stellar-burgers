import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { fetchProfileOrders } from '../../services/orders/slice';
import {
  selectProfileOrders,
  selectProfileOrdersLoading
} from '../../services/selectors';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectProfileOrders);
  const isProfileOrdersLoading = useSelector(selectProfileOrdersLoading);

  useEffect(() => {
    dispatch(fetchProfileOrders());
  }, [dispatch]);

  if (!orders.length && isProfileOrdersLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
