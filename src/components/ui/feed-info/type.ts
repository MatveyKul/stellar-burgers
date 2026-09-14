export type TFeed = {
  total: number;
  totalToday: number;
};

export type FeedInfoUIProps = {
  feed: TFeed;
  readyOrders: number[];
  pendingOrders: number[];
};

export type HalfColumnProps = {
  orders: number[];
  title: string;
  textColor?: string;
};

export type TColumnProps = {
  title: string;
  content: number;
};
