const express = require('express');

const router = express.Router();
const knex = require('../knex');
//const { camelizeKeys } = require('humps');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const env = require('./../env');

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
    knex('Doctor').where('email', req.body.email).then(record => {
      if (record) {
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
            //console.log(doctors);
            const doctor = doctors[0];
            let token = jwt.sign(
              {
                id: doctor.id,
                firstName: doctor.first_name,
                lastName: doctor.last_name,
                email: doctor.email
              },
              env.JWT_KEY
            );
            res.status(200).cookie('token', token, { httpOnly: true }).json({
              id: doctor.id,
              firstName: doctor.firstName,
              lastName: doctor.lastName,
              email: doctor.email
            });
            // delete doctor.hashed_password;
            // res.json(camelizeKeys(doctor));
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
  }
});
module.exports = router;
