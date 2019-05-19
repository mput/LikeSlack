/* eslint-disable */
import channels from './channels';
import auth from './auth';
import users from './users';
const routes = [channels, auth, users];

export default (router, deps) => {
  routes.forEach(getRouter => {
    const subRouter = getRouter(deps);
    router.use('/api/v1', subRouter.routes(), subRouter.allowedMethods());
  })
};
