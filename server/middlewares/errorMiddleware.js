import logger from '../lib/logger';

const log = logger('error');

export default async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    log(err, err.status);
    // console.log(err, err.status);
    let errors;
    switch (true) {
      case err.name === 'ValidationError': {
        ctx.status = 422;
        const errSource = err.inner.length ? err.inner : [err];
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
      default: {
        ctx.status = err.status || 500;
        errors = {
          status: String(ctx.status),
          title: 'UnknownError',
        };
        break;
      }
    }
    ctx.body = { errors };
  }
};
