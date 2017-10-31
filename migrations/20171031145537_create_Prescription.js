exports.up = function(knex) {
  return knex.schema.createTable('Prescription', table => {
    table.increments('id').primary();
    table.string('date').notNullable().defaultTo(new Date().toDateString());

    table.integer('patientId').unsigned().notNullable();
    table.foreign('patientId').references('Patient.id').onDelete('CASCADE');
    table.integer('doctorId').unsigned().notNullable();
    table.foreign('doctorId').references('Doctor.id').onDelete('CASCADE');

    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('Prescription');
};
