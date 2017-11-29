const express = require('express');

const router = express.Router();
const knex = require('../knex');
const jwt = require('jsonwebtoken');

router.get('/doctors/:doctorId/patients', (req, res, next) => {
  let storedToken = req.headers.authorization;
  let decodedToken = jwt.decode(storedToken);
  //console.log(storedToken, decodedToken);
  let theDoctorId = decodedToken.id;
  //console.log(theDoctorId);
  if (!storedToken) {
    res.set('Content-Type', 'text/plain');
    res.status(401).send('Unauthorized');
    return;
  } else {
    knex('Patient')
      .where('doctorId', theDoctorId)
      //.first()
      .then(patients => {
        if (!patients) {
          res.set('Content-Type', 'text/plain');
          res.status(404).send('Patient Not Found');
        }
        //console.log(patients);
        res.json(patients);
      })
      .catch(err => {
        next(err);
      });
  }
});

// router.get('/doctors/:doctorId/patients', (req, res, next) => {
//   knex('Patient')
//     .orderBy('generic')
//     .then(patients => {
//       //console.log('to see the patients', patients);
//       res.json(patients);
//     })
//     .catch(err => {
//       next(err);
//     });
// });

router.get('/doctors/:doctorId/patients/:id', (req, res, next) => {
  let storedToken = req.headers.authorization;
  let decodedToken = jwt.decode(storedToken);
  let theDoctorId = decodedToken.id;
  //console.log(storedToken);
  if (!storedToken) {
    res.set('Content-Type', 'text/plain');
    res.status(401).send('Unauthorized');
  } else {
    let id = req.params.id;
    if (id <= 0 || id >= 1000 || isNaN(id)) {
      res.set('Content-Type', 'text/plain');
      res.status(404).send('Not Found');
    } else {
      knex('Patient')
        .where('doctorId', theDoctorId)
        .first()
        .then(patient => {
          if (!patient) {
            res.set('Content-Type', 'text/plain');
            res.status(404).send('Patient Not Found');
          }

          res.json(patient);
        })
        .catch(err => {
          next(err);
        });
    }
  }
});

router.post('/doctors/:doctorId/patients', (req, res, next) => {
  //console.log('hi');
  let storedToken = req.headers.authorization;
  let decodedToken = jwt.decode(storedToken);
  let theDoctorId = decodedToken.id;
  //console.log(storedToken);
  if (!decodedToken) {
    res.set('Content-Type', 'text/plain');
    res.status(401).send('Unauthorized');
  } else {
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
      knex('Patient')
        .insert(
          {
            doctorId: req.params.doctorId,
            generic: req.body.generic,
            brand: req.body.brand,
            indications: req.body.indications
          },
          '*'
        )
        .where('doctorId', theDoctorId)
        .then(patients => {
          //console.log(patients);
          res.json(patients[0]);
        })
        .catch(err => {
          //console.log('this is the err', err);
          next(err);
        });
    }
  }
});

router.patch('/patients/:id', (req, res, next) => {
  let id = req.params.id;
  if (id <= 0 || id >= 1000 || isNaN(id)) {
    res.set('Content-Type', 'text/plain');
    res.status(404).send('Not Found');
  } else {
    knex('Patient')
      .where('id', req.params.id)
      .first()
      // .then(patient => {
      //   if (!patient) {
      //     return next();
      //   }
      .then(patient => {
        return knex('Patient')
          .update(
            {
              doctorId: req.params.doctorId,
              generic: req.body.generic,
              brand: req.body.brand,
              indications: req.body.indications
            },
            '*'
          )
          .where('id', req.params.id);
      })
      .then(patients => {
        res.json(patients[0]);
      })
      .catch(err => {
        next(err);
      });
  }
});

router.delete('/patients/:id', (req, res, next) => {
  let id = req.params.id;
  if (id <= 0 || id >= 1000 || isNaN(id)) {
    res.set('Content-Type', 'text/plain');
    res.status(404).send('Not Found');
  } else {
    let patient;
    knex('Patient')
      .where('id', req.params.id)
      .first()
      .then(row => {
        if (!row) {
          return next();
        }

        patient = row;

        return knex('Patient').del().where('id', req.params.id);
      })
      .then(() => {
        delete patient.id;
        res.json(patient);
      })
      .catch(err => {
        next(err);
      });
  }
});

module.exports = router;
