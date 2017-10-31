exports.seed = function(knex) {
  // Deletes ALL existing entries

  return knex('Patient')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('Patient').insert([
        {
          id: 1,
          doctorId: 1,
          name: 'Lisa Chang',
          dob: '1/1/1987'
        },
        {
          id: 2,
          doctorId: 1,
          name: 'Taylor Swift',
          dob: '12/13/1989'
        },
        {
          id: 3,
          doctorId: 1,
          name: 'Justin Bieber',
          dob: '3/1/1994'
        },
        {
          id: 4,
          doctorId: 1,
          name: 'Emma Stone',
          dob: '11/6/1988'
        },
        {
          id: 5,
          doctorId: 1,
          name: 'Chris Evans',
          dob: '6/13/1981'
        }
      ]);
    })
    .then(() =>
      knex.raw(
        `SELECT setval('"Patient_id_seq"', (SELECT MAX("id") FROM "Patient"))`
      )
    );
};
