exports.seed = function(knex) {
  // Deletes ALL existing entries

  return knex('Prescription')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('Prescription').insert([
        {
          id: 1,
          patientId: 1,
          doctorId: 1
        },
        {
          id: 2,
          patientId: 2,
          doctorId: 1
        },
        {
          id: 3,
          patientId: 2,
          doctorId: 1
        }
      ]);
    })
    .then(() =>
      knex.raw(
        `SELECT setval('"Prescription_id_seq"', (SELECT MAX("id") FROM "Prescription"))`
      )
    );
};
