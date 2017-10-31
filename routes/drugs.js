const express = require('express');

const router = express.Router();
const knex = require('../knex');

router.get('/doctors/:doctorId/drugs', (req, res, next) => {
  knex('drugs')
    .orderBy('generic')
    .then(drugs => {
      //console.log('to see the body', res);
      res.json(drugs);
    })
    .catch(err => {
      next(err);
    });
});

router.get('/doctors/:doctorId/drugs/:id', (req, res, next) => {
  let id = req.params.id;
  if (id <= 0 || id >= 1000 || isNaN(id)) {
    res.set('Content-Type', 'text/plain');
    res.status(404).send('Not Found');
  } else {
    knex('drugs')
      .where('id', req.params.id)
      .first()
      .then(drug => {
        if (!drug) {
          const err = new Error('Not Found');

          err.status = 404;

          throw err;
        }

        res.json(drug);
      })
      .catch(err => {
        next(err);
      });
  }
});

router.post('/doctors/:doctorId/drugs', (req, res, next) => {
  if (!req.body.generic) {
    res.set('Content-Type', 'text/plain');
    res.status(400).send('Generic must not be blank');
  } else if (!req.body.brand) {
    res.set('Content-Type', 'text/plain');
    res.status(400).send('Brand must not be blank');
  } else if (!req.body.indications) {
    res.set('Content-Type', 'text/plain');
    res.status(400).send('Indications must not be blank');
  } else {
    knex('drugs')
      .insert(
        {
          generic: req.body.generic,
          brand: req.body.brand,
          indications: req.body.indicatons
        },
        '*'
      )
      .then(drugs => {
        //console.log(drugs);
        res.json(drugs[0]);
      })
      .catch(err => {
        next(err);
      });
  }
});

router.patch('/drugs/:id', (req, res, next) => {
  let id = req.params.id;
  if (id <= 0 || id >= 1000 || isNaN(id)) {
    res.set('Content-Type', 'text/plain');
    res.status(404).send('Not Found');
  } else {
    knex('drugs')
      .where('id', req.params.id)
      .first()
      .then(drug => {
        if (!drug) {
          return next();
        }

        return knex('drugs')
          .update(
            {
              generic: req.body.generic,
              brand: req.body.brand,
              indications: req.body.indicatons
            },
            '*'
          )
          .where('id', req.params.id);
      })
      .then(drugs => {
        res.json(drugs[0]);
      })
      .catch(err => {
        next(err);
      });
  }
});

router.delete('/drugs/:id', (req, res, next) => {
  let id = req.params.id;
  if (id <= 0 || id >= 1000 || isNaN(id)) {
    res.set('Content-Type', 'text/plain');
    res.status(404).send('Not Found');
  } else {
    let drug;
    knex('drugs')
      .where('id', req.params.id)
      .first()
      .then(row => {
        if (!row) {
          return next();
        }

        drug = row;

        return knex('drugs').del().where('id', req.params.id);
      })
      .then(() => {
        delete drug.id;
        res.json(drug);
      })
      .catch(err => {
        next(err);
      });
  }
});

module.exports = router;
