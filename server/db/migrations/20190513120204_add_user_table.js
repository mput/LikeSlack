exports.up = knex => (
  knex.schema
    .createTable('users', (t) => {
      t.increments('id');
      t.string('auth_provider').notNullable();
      t.string('user_name');
      t.string('validation_key');
      t.string('profile_url');
      t.timestamps(true, true);
    })
    .createTable('refresh_tokens', (t) => {
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
    .dropTable('refresh_tokens')
    .dropTable('users')
);
