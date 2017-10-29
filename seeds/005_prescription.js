exports.seed = function(knex) {
  // Deletes ALL existing entries

  return knex('prescription')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('prescription').insert([
        {
          id: 1,
          prescriptiondrugId: 1,
          patientId: 1,
          doctorId: 1
        },
        {
          id: 2,
          prescriptiondrugId: 2,
          patientId: 2,
          doctorId: 1
        },
        {
          id: 3,
          prescriptiondrugId: 3,
          patientId: 2,
          doctorId: 1
        }
      ]);
    })
    .then(() =>
      knex.raw(
        "SELECT setval('prescription_id_seq', (SELECT MAX(id) FROM prescription))"
      )
    );
};
