exports.seed = function(knex) {
  // Deletes ALL existing entries

  return knex('Prescriptiondrug')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('Prescriptiondrug').insert([
        {
          id: 1,
          drugId: 1,
          prescriptionId: 1,
          dosage: '10 mg once daily'
        },
        {
          id: 2,
          drugId: 1,
          prescriptionId: 1,
          dosage: '20 mg once daily'
        },
        {
          id: 3,
          drugId: 2,
          prescriptionId: 3,
          dosage: '50 mcg once daily'
        }
      ]);
    })
    .then(() =>
      knex.raw(
        `SELECT setval('"Prescriptiondrug_id_seq"', (SELECT MAX("id") FROM "Prescriptiondrug"))`
      )
    );
};
