exports.up = function(knex) {
  return knex.schema.createTable('prescription', table => {
    table.increments('id').primary();

    table.integer('prescriptiondrugId').unsigned().notNullable();
    table
      .foreign('prescriptiondrugId')
      .references('prescriptiondrug.id')
      .onDelete('CASCADE');
    table.integer('patientId').unsigned().notNullable();
    table.foreign('patientId').references('patient.id').onDelete('CASCADE');
    table.integer('doctorId').unsigned().notNullable();
    table.foreign('doctorId').references('doctor.id').onDelete('CASCADE');

    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('prescription');
};
