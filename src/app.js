import renderBalancesButton from './features/group-balances/enable.js';
import Router from './router.js';

export const run = () => {
  const router = new Router([
    [/^#\/groups\/([0-9]+)$/, renderBalancesButton],
  ]);
  router.handleCurrentHash();
};
