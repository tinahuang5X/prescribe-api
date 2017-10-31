exports.seed = function(knex) {
  // Deletes ALL existing entries

  return knex('Doctor')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('Doctor').insert([
        {
          id: 1,
          firstName: 'Tina',
          lastName: 'Huang',
          email: 'tinahuang@gmail.com',
          hashedPassword:
            '$2a$12$C9AYYmcLVGYlGoO4vSZTPud9ArJwbGRsJ6TUsNULzR48z8fOnTXbS'
        }
      ]);
    })
    .then(() =>
      knex.raw(
        `SELECT setval('"Doctor_id_seq"', (SELECT MAX("id") FROM "Doctor"))`
      )
    );
};
