exports.up = knex => (
  knex.schema
    .createTable('users', (t) => {
      t.increments('id');
      t.string('auth_provider').notNullable();
      t.string('user_name').notNullable();
      t.string('full_name');
      t.string('validation_key');
      t.string('profile_url');
      t.timestamps(true, true);
    })
    .createTable('channels', (table) => {
      table.increments('id').primary();
      table.string('name').unique().notNullable();
      table.boolean('removable').defaultTo(true);
      table.boolean('default').defaultTo(false);
      table.timestamps(true, true);
    })
    .createTable('messages', (table) => {
      table.increments('id');
      table.text('message');
      table.integer('author_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table.integer('channel_id')
        .notNullable()
        .references('id')
        .inTable('channels')
        .onDelete('CASCADE');
      table.timestamps(true, true);
    })
    .createTable('sessions', (t) => {
      t.increments('id');
      t.integer('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      t.timestamp('expire_at');
      t.timestamps(true, true);
    })
);

exports.down = knex => (
  knex.schema
    .dropTable('messages')
    .dropTable('channels')
    .dropTable('sessions')
    .dropTable('users')
);
