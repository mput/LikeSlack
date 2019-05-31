exports.seed = async (knex) => {
  const tables = ['messages', 'channels', 'users'];
  await Promise.all(tables.map(
    table => knex.raw(`TRUNCATE table ${table} RESTART IDENTITY CASCADE`),
  ));
  const channelsIds = await knex('channels')
    .returning('id')
    .insert([
      { name: 'general', removable: false, default: true },
      { name: 'random', removable: false },
      { name: 'compsci' },
    ]);
  const usersIds = await knex('users')
    .returning('id')
    .insert([
      { authProvider: 'github', userName: 'Andrew' },
      { authProvider: 'github', userName: 'MarvelMan' },
      { authProvider: 'github', userName: 'OneMore' },
    ]);
  await knex('messages').insert([
    { message: 'How are you?', authorId: usersIds[0], channelId: channelsIds[0] },
    { message: 'Light my fire!!', authorId: usersIds[0], channelId: channelsIds[1] },
    { message: 'Hello, i\'m fine', authorId: usersIds[1], channelId: channelsIds[0] },
    { message: 'Oh my message', authorId: usersIds[1], channelId: channelsIds[0] },
    { message: 'Is anybody out there?', authorId: usersIds[0], channelId: channelsIds[1] },
  ]);
};
