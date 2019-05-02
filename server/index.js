import path from 'path';
import Koa from 'koa';
import Pug from 'koa-pug';
import socket from 'socket.io';
import http from 'http';
import mount from 'koa-mount';
import serve from 'koa-static';
import Router from 'koa-router';
import koaLogger from 'koa-logger';
import koaWebpack from 'koa-webpack';
import bodyParser from 'koa-bodyparser';
// import session from 'koa-generic-session';
import passport from 'koa-passport';

import logger from './lib/logger';
import addRoutes from './routes';
import authInit from './lib/authInit';

import webpackConfig from '../webpack.config';
import errorMiddleware from './middlewares/errorMiddleware';

// const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

export default () => {
  const app = new Koa();
  // app.keys = ['some secret hurr'];
  app.use(errorMiddleware);
  // app.use(session(app));
  app.use(bodyParser());

  if (isDevelopment) {
    koaWebpack({
      config: webpackConfig,
      hotClient: false,
      devMiddleware: {
        stats: 'minimal',
        lazy: true,
      },
    }).then((middleware) => {
      app.use(middleware);
    });
  } else {
    const urlPrefix = '/assets';
    const assetsPath = path.resolve(`${__dirname}/../dist/public`);
    app.use(mount(urlPrefix, serve(assetsPath)));
  }

  if (!isTest) {
    app.use(koaLogger());
  }

  const pug = new Pug({
    viewPath: path.join(__dirname, '..', 'views'),
    debug: true,
    pretty: true,
    compileDebug: true,
    noCache: process.env.NODE_ENV !== 'production',
    basedir: path.join(__dirname, 'views'),
  });
  pug.use(app);
  authInit();
  app.use(passport.initialize());

  const server = http.createServer(app.callback());
  const io = socket(server);
  const deps = { io, logger };

  const router = new Router();
  addRoutes(router, deps);
  app.use(router.routes(), router.allowedMethods());

  return server;
};
