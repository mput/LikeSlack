import db from '../db';

export default (router) => {
  router.get('/', async (ctx) => {
    const channels = await db
      .select()
      .from('channels');
    const messages = await db
      .select()
      .from('messages');
    ctx.render('index', { title: 'LikeSlack', gon: { channels, messages } });
  });
};
