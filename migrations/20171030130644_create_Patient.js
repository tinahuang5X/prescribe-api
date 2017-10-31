exports.up = function(knex) {
  return knex.schema.createTable('Patient', table => {
    table.increments('id').primary();
    table.string('name').notNullable().defaultTo('');
    table.string('dob').notNullable().defaultTo('');
    table.integer('doctorId').unsigned().notNullable();
    table.foreign('doctorId').references('Doctor.id').onDelete('CASCADE');

    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('Patient');
};
