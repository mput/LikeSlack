import auth from './auth';
import channels from './channels';
import messages from './messages';

const routes = [channels, auth, messages];

export default (router, deps) => {
  router.use()
  routes.forEach((getRouter) => {
    const subRouter = getRouter(deps);
    router.use('/api/v1', subRouter.routes(), subRouter.allowedMethods());
  });
};
