// @flow

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
import session from 'koa-generic-session';
import _ from 'lodash';
import addRoutes from './routes';

import webpackConfig from '../webpack.config';

// const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

export default () => {
  const app = new Koa();

  app.keys = ['some secret hurr'];
  app.use(session(app));
  app.use(bodyParser());
  if (isDevelopment) {
    koaWebpack({
      config: webpackConfig,
      hotClient: false,
    }).then((middleware) => {
      app.use(middleware);
    });
  } else {
    const urlPrefix = '/assets';
    const assetsPath = path.resolve(`${__dirname}/../dist/public`);
    app.use(mount(urlPrefix, serve(assetsPath)));
  }

  const router = new Router();

  if (!isTest) {
    app.use(koaLogger());
  }

  const pug = new Pug({
    viewPath: path.join(__dirname, '..', 'views'),
    debug: true,
    pretty: true,
    compileDebug: true,
    locals: [],
    noCache: process.env.NODE_ENV !== 'production',
    basedir: path.join(__dirname, 'views'),
    helperPath: [
      { _ },
      { urlFor: (...args) => router.url(...args) },
    ],
  });
  pug.use(app);

  const server = http.createServer(app.callback());
  const io = socket(server);

  io.on('connection', () => {
    io.emit('ping'); // can't stop server in tests while no events emited.
  });

  addRoutes(router, io);
  app.use(router.allowedMethods());
  app.use(router.routes());

  return server;
};
