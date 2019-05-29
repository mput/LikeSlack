import logger from '../lib/logger';
// import errors from '../lib/errors';

const log = logger('ErrorMiddleware');

export default async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    // log(err);
    // console.log(err, err.status);
    let errors;
    switch (true) {
      case err.name === 'ValidationError': {
        ctx.status = 422;
        const errSource = err.inner ? err.inner : [err];
        errors = errSource.map(errItem => ({
          status: String(422),
          title: errItem.name,
          detail: errItem.message,
          source: {
            pointer: errItem.path,
          },
        }));
        break;
      }
      case err.code === '23505': {
        ctx.status = 422;
        errors = [{
          status: String(422),
          title: 'DuplicationError',
          detail: err.detail,
        }];
        break;
      }
      case !!err.statusCode: {
        ctx.status = err.statusCode;
        errors = {
          status: String(ctx.status),
          title: err.name || 'Unknown error',
        };
        break;
      }
      default: {
        log('Unknown err', err);
        ctx.status = 500;
        errors = {
          status: String(ctx.status),
          title: 'Unknown error',
        };
        break;
      }
    }
    log('%O', errors);
    ctx.body = { errors };
  }
};
