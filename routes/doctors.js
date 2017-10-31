const express = require('express');

const router = express.Router();
const knex = require('../knex');
//const { camelizeKeys } = require('humps');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const env = require('./../env');

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
    knex('doctors').where('email', req.body.email).then(record => {
      if (record) {
        bcrypt
          .hash(req.body.password, 12)
          .then(hashedPassword => {
            return knex('doctors').insert(
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
