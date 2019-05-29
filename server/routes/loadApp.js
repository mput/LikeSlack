import { Channel, Message } from '../models';

export default (router) => {
  router.get('/', async (ctx) => {
    const channels = await Channel.query().eager('messages');
    const messages = await Message.query().eager('channel');
    ctx.render('index', { title: 'LikeSlack', gon: { channels, messages } });
  });
};
