import getLoadAppRouter from './loadApp';
import getApiRouter from './api';

export default (router, deps) => {
  getLoadAppRouter(router, deps);
  getApiRouter(router, deps);
};
