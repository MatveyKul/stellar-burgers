import { FC } from 'react';
import clsx from 'clsx';

import styles from './profile-orders.module.css';

import { ProfileOrdersUIProps } from './type';
import { ProfileMenu, OrdersList } from '@components';

export const ProfileOrdersUI: FC<ProfileOrdersUIProps> = ({ orders }) => (
  <main className={clsx(styles.main)}>
    <div className={clsx('mt-30 mr-15', styles.menu)}>
      <ProfileMenu />
    </div>
    <div className={clsx('mt-10', styles.orders)}>
      <OrdersList orders={orders} />
    </div>
  </main>
);
