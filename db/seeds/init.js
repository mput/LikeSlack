exports.seed = async (knex) => {
  await knex('channels').del();
  const ids = await knex('channels')
    .returning('id')
    .insert([
      { name: 'general', removable: false },
      { name: 'random', removable: false },
      { name: 'compsci' },
    ]);
  await knex('messages').insert([
    { message: 'How are you?', author: 'superUser', channelId: ids[0] },
    { message: 'Hello, i\'m fine', author: 'superUser', channelId: ids[0] },
    { message: 'Is anybody out there?', author: 'superUser', channelId: ids[1] },
  ]);
};
