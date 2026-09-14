import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds } from '../../services/orders/slice';
import { selectOrders, selectOrdersLoading } from '../../services/selectors';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const isOrdersLoading = useSelector(selectOrdersLoading);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (!orders.length && isOrdersLoading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
