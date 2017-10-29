exports.up = function(knex) {
  return knex.schema.createTable('prescriptiondrug', table => {
    table.increments('id').primary();

    table.integer('drugId').unsigned().notNullable();
    table.foreign('drugId').references('drug.id').onDelete('CASCADE');

    table.string('dosage').notNullable().defaultTo('');

    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('prescriptiondrug');
};
