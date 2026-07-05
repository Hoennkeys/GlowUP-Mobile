import type { RouteName } from '../constants';

export type RootStackParamList = {
  [K in RouteName]: undefined;
};
