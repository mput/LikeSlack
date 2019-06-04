import axios from 'axios';
import { tokensRefresh } from '../routes';
import handleTokens from './handleTokens';
import logger from './logger';
import { logOut } from '../actions/thunkActions';

const log = logger('axios-intercepter');

const faultAccessTokenCode = 403;
const faultRefreshTokenCode = 403;

const initAxiosIntercepter = (store) => {
  const setRequestIntercepter = () => {
    axios.interceptors.request.use((userConfig) => {
      const config = {
        withAccessToken: true,
        withRefreshToken: false,
        ...userConfig,
      };
      const { refreshToken, accessToken } = handleTokens.getTokens();
      if (config.withAccessToken && accessToken) {
        config.headers.authorization = `JWT ${accessToken}`;
      }
      if (config.withRefreshToken) {
        config.headers.refresh = `token ${refreshToken}`;
      }
      return config;
    });
  };

  const refreshTokens = async () => {
    try {
      const response = await axios.get(tokensRefresh(), {
        withRefreshToken: true,
      });
      const { data: tokens } = response;
      handleTokens.saveTokens(tokens);
      log('Tokens was updated');
    } catch (e) {
      if (e.response.status === faultRefreshTokenCode) {
        store.dispatch(logOut());
        handleTokens.removeTokens();
        log('Can\'t refresh tokens');
      }
      throw e;
    }
  };

  const setResponseIntercepter = () => {
    const intercepter = axios.interceptors.response.use(
      null,
      (error) => {
        if (error.response.status !== faultAccessTokenCode) {
          return Promise.reject(error);
        }
        log('Refreshing token...');
        axios.interceptors.response.eject(intercepter);
        const refresh = refreshTokens();
        // Create interceptor that will bind all the others requests
        // until refreshTokenCall is resolved
        const requestQueueInterceptorId = axios.interceptors
          .request
          .use(request => refresh.then(() => request));
        return refresh.then(() => {
          axios.interceptors.request.eject(requestQueueInterceptorId);
          return axios(error.response.config);
        }).catch((err) => {
          axios.interceptors.request.eject(requestQueueInterceptorId);
          return Promise.reject(err);
        }).finally(() => setResponseIntercepter());
      },
    );
  };
  setRequestIntercepter();
  setResponseIntercepter();
};

export default initAxiosIntercepter;
