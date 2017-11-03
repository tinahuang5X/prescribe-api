const express = require('express');

const router = express.Router();
const knex = require('../knex');
//const { camelizeKeys } = require('humps');
const bcrypt = require('bcryptjs');

//const jwt = require('jsonwebtoken');
//const env = require('./../env');

router.get('/doctors', (req, res, next) => {
  knex('Doctor')
    .orderBy('lastName')
    .then(doctors => {
      //console.log('to see the drugs', drugs);
      res.json(doctors);
    })
    .catch(err => {
      next(err);
    });
});

router.get('/doctors/:id', (req, res, next) => {
  let id = req.params.id;
  if (id <= 0 || id >= 1000 || isNaN(id)) {
    res.set('Content-Type', 'text/plain');
    res.status(404).send('Not Found');
  } else {
    knex('Doctor')
      .where('id', req.params.id)
      .first()
      .then(doctor => {
        if (!doctor) {
          res.set('Content-Type', 'text/plain');
          res.status(404).send('Doctor Not Found');
        }

        res.json(doctor);
      })
      .catch(err => {
        next(err);
      });
  }
});

router.post('/doctors', (req, res, next) => {
  if (!req.body.email) {
    res.set('Content-Type', 'text/plain');
    res.status(400).send('Email must not be blank');
    return;
  }
  if (!req.body.password) {
    res.set('Content-Type', 'text/plain');
    res.status(400).send('Password must be at least 8 characters long');
    return;
  } else {
    bcrypt
      .hash(req.body.password, 12)
      .then(hashedPassword => {
        return knex('Doctor').insert(
          {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            hashedPassword: hashedPassword
          },
          '*'
        );
      })
      .then(doctors => {
        const doctor = doctors[0];
        delete doctor.hashedPassword;
        res.json(doctor);
      })
      .catch(err => {
        if (err.code === '23505') {
          res.set('Content-Type', 'text/plain');
          res.status(400).send('Email already exists');
        } else
          //console.log(err);
          next(err);
      });
  }
});

router.patch('/doctors/:id', (req, res, next) => {
  let id = req.params.id;
  if (id <= 0 || id >= 1000 || isNaN(id)) {
    res.set('Content-Type', 'text/plain');
    res.status(404).send('Not Found');
  } else {
    knex('Doctor')
      .where('id', req.params.id)
      .first()
      // .then(drug => {
      //   if (!drug) {
      //     return next();
      //   }
      .then(drug => {
        return knex('Doctor')
          .update(
            {
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email,
              hashedPassword: req.body.hashedPassword
            },
            '*'
          )
          .where('id', req.params.id);
      })
      .then(doctors => {
        res.json(doctors[0]);
      })
      .catch(err => {
        next(err);
      });
  }
});

router.delete('/doctors/:id', (req, res, next) => {
  let id = req.params.id;
  if (id <= 0 || id >= 1000 || isNaN(id)) {
    res.set('Content-Type', 'text/plain');
    res.status(404).send('Not Found');
  } else {
    let doctor;
    knex('Doctor')
      .where('id', req.params.id)
      .first()
      .then(row => {
        if (!row) {
          return next();
        }

        doctor = row;

        return knex('Doctor').del().where('id', req.params.id);
      })
      .then(() => {
        delete doctor.id;
        res.json(doctor);
      })
      .catch(err => {
        next(err);
      });
  }
});

module.exports = router;
