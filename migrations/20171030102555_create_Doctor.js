exports.up = function(knex) {
  return knex.schema.createTable('Doctor', table => {
    table.increments('id').primary();
    table.string('firstName').notNullable().defaultTo('');
    table.string('lastName').notNullable().defaultTo('');
    table.string('email').unique().notNullable();
    table.specificType('hashedPassword', 'char(60)').notNullable();

    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('Doctor');
};
