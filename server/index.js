import 'dotenv/config';
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
import cookie from 'koa-cookie';
import passport from 'koa-passport';
import enforceHttps, { xForwardedProtoResolver as resolver  } from 'koa-sslify';

import initDb from './db';
import logger from './lib/logger';
import addRoutes from './routes';
import authInit from './lib/authInit';

import webpackConfig from '../webpack.config';
import errorMiddleware from './middlewares/errorMiddleware';
import eventEmitter from './middlewares/eventEmitter';

// const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

export default () => {
  initDb();
  const app = new Koa();

  if (!(isTest || isDevelopment)) {
    app.use(enforceHttps({ resolver }));
  }
  if (!isTest) {
    app.use(koaLogger());
  }
  app.use(errorMiddleware);
  app.use(bodyParser());
  app.use(cookie());

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


  const pug = new Pug({
    viewPath: path.join(__dirname, '..', 'views'),
    basedir: path.join(__dirname, 'views'),
    pretty: true,
  });
  pug.use(app);
  authInit();
  app.use(passport.initialize());

  const server = http.createServer(app.callback());
  const io = socket(server);
  app.use(eventEmitter(io));

  const deps = { io, logger };

  const router = new Router();
  addRoutes(router, deps);
  app.use(router.routes(), router.allowedMethods());

  return server;
};
