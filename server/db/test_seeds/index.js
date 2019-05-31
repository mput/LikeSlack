exports.seed = async (knex) => {
  const tables = ['messages', 'channels', 'users'];
  await Promise.all(tables.map(
    table => knex.raw(`TRUNCATE table ${table} RESTART IDENTITY CASCADE`),
  ));
  await knex('channels')
    .returning('id')
    .insert([
      {
        name: 'general',
        removable: false,
        default: true,
        createdAt: '2019-05-19T18:14:59.900Z',
        updatedAt: '2019-05-19T18:14:59.900Z',
      },
      {
        name: 'random',
        removable: false,
        createdAt: '2019-05-19T18:14:59.900Z',
        updatedAt: '2019-05-19T18:14:59.900Z',
      },
      {
        name: 'compsci',
        createdAt: '2019-05-19T18:25:30.900Z',
        updatedAt: '2019-05-19T18:42:12.900Z',
      },
    ]);
  await knex('users')
    .returning('id')
    .insert([
      {
        authProvider: 'github',
        userName: 'Andrew',
        createdAt: '2019-05-29T18:14:59.900Z',
        updatedAt: '2019-05-29T18:14:59.900Z',
      },
      {
        authProvider: 'github',
        userName: 'MarvelMan',
        createdAt: '2019-05-29T18:15:59.900Z',
        updatedAt: '2019-05-29T18:18:59.900Z',
      },
      {
        authProvider: 'github',
        userName: 'OneMore',
        createdAt: '2019-05-29T18:16:59.900Z',
        updatedAt: '2019-05-29T18:22:59.900Z',
      },
    ]);

  await knex('messages').insert([
    {
      message: 'How are you?',
      authorId: 1,
      channelId: 1,
      createdAt: '2019-05-29T18:15:59.900Z',
      updatedAt: '2019-05-29T18:15:59.900Z',
    },
    {
      message: 'Light my fire!!',
      authorId: 1,
      channelId: 2,
      createdAt: '2019-05-29T18:16:59.900Z',
      updatedAt: '2019-05-29T18:16:59.900Z',
    },
    {
      message: 'Hello, i\'m fine',
      authorId: 2,
      channelId: 1,
      createdAt: '2019-05-29T18:22:59.900Z',
      updatedAt: '2019-05-29T18:24:59.900Z',
    },
    {
      message: 'Oh my message',
      authorId: 2,
      channelId: 1,
      createdAt: '2019-05-29T18:31:59.900Z',
      updatedAt: '2019-05-29T18:33:59.900Z',
    },
    {
      message: 'Is anybody out there?',
      authorId: 1,
      channelId: 2,
      createdAt: '2019-05-29T18:35:59.900Z',
      updatedAt: '2019-05-29T18:35:59.900Z',
    },
  ]);
};
