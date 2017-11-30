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
          dob: '1/1/1987',
          phone: '123-4567',
          address: '123 Main St. SF, CA 94102'
        },
        {
          id: 2,
          doctorId: 1,
          name: 'Taylor Swift',
          dob: '12/13/1989',
          phone: '888-4438',
          address: '80 Heaven Rd. Miami, FL 39555'
        },
        {
          id: 3,
          doctorId: 1,
          name: 'Justin Bieber',
          dob: '3/1/1994',
          phone: '333-4455',
          address: '100 Hollywood Dr. LA, CA 93103'
        },
        {
          id: 4,
          doctorId: 1,
          name: 'Emma Stone',
          dob: '11/6/1988',
          phone: '222-4444',
          address: '48 La La Lane, LA, CA 93105'
        },
        {
          id: 5,
          doctorId: 1,
          name: 'Chris Evans',
          dob: '6/13/1981',
          phone: '987-6543',
          address: '210 Captain Rd. San Diego, CA 93401'
        }
      ]);
    })
    .then(() =>
      knex.raw(
        `SELECT setval('"Patient_id_seq"', (SELECT MAX("id") FROM "Patient"))`
      )
    );
};
