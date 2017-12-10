exports.seed = function(knex) {
  // Deletes ALL existing entries

  return knex('Drug')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('Drug').insert([
        {
          id: 1,
          doctorId: 1,
          generic: 'atorvastatin',
          brand: 'Liptor',
          indications: 'lower cholesterol'
        },
        {
          id: 2,
          doctorId: 1,
          generic: 'levothyroxine',
          brand: 'Synthroid',
          indications: 'treat hypothyroidism'
        },
        {
          id: 3,
          doctorId: 1,
          generic: 'metformin',
          brand: 'Glucophage',
          indications: 'treat type 2 diabetes'
        },
        {
          id: 4,
          doctorId: 1,
          generic: 'omeprazole',
          brand: 'Prilosec',
          indications: 'treat gastroesophageal reflux disease'
        },
        {
          id: 5,
          doctorId: 1,
          generic: 'azithromycin',
          brand: 'Zithromax',
          indications: 'treat infections caused by bacteria'
        }
      ]);
    })
    .then(() =>
      knex.raw(`SELECT setval('"Drug_id_seq"', (SELECT MAX("id") FROM "Drug"))`)
    );
};
