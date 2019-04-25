exports.up = knex => (
  knex.schema
    .createTable('channels', (table) => {
      table.increments('id');
      table.string('name').unique().notNullable();
      table.boolean('removable').defaultTo(true);
      table.timestamps(true, true);
    })
    .createTable('messages', (table) => {
      table.increments('id');
      table.text('message');
      table.string('author').notNullable();
      table.integer('channelId')
        .notNullable()
        .references('id')
        .inTable('channels')
        .onDelete('CASCADE');
      table.timestamps(true, true);
    })
);

exports.down = knex => (
  knex.schema
    .dropTable('messages')
    .dropTable('channels')
);
