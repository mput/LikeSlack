/* eslint-disable */
import channels from './channels';
import auth from './auth';
const routes = [channels, auth];

export default (router, deps) => {
  routes.forEach(getRouter => {
    const subRouter = getRouter(deps);
    router.use('/api/v1', subRouter.routes(), subRouter.allowedMethods());
  })
};
