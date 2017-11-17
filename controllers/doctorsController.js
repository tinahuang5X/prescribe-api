const knex = require('../knex');
//const bcrypt = require('bcryptjs');
//const jwt = require('jsonwebtoken');

class DoctorsController {
  constructor({ doctorTable }) {
    this._doctor = knex(doctorTable);
    this._bindMethods(['getAll', 'getOne', 'create', 'patch', 'delete']);
  }

  getAll(req, res, next) {
    this._doctor
      .orderBy('lastName')
      .then(doctors => {
        //console.log('to see the drugs', drugs);
        res.json(doctors);
      })
      .catch(err => {
        next(err);
      });
  }
  getOne(req, res, next) {
    let id = req.params.id;
    if (id <= 0 || id >= 1000 || isNaN(id)) {
      res.set('Content-Type', 'text/plain');
      res.status(404).send('Not Found');
    } else {
      this._doctor
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
  }

  create(req, res, next) {
    if (!req.body.email) {
      res.set('Content-Type', 'text/plain');
      res.status(400).send('Email must not be blank');
      return;
    }
    if (req.body.password.length < 8) {
      res.set('Content-Type', 'text/plain');
      res.status(400).send('Password must be at least 8 characters long');
      return;
    } else {
      bcrypt
        .hash(req.body.password, 12)
        .then(hashedPassword => {
          return this._doctor.insert(
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
  }

  patch(req, res, next) {
    let id = req.params.id;
    if (id <= 0 || id >= 1000 || isNaN(id)) {
      res.set('Content-Type', 'text/plain');
      res.status(404).send('Not Found');
    } else {
      this._doctor
        .where('id', req.params.id)
        .first()
        // .then(drug => {
        //   if (!drug) {
        //     return next();
        //   }
        .then(drug => {
          return this._doctor
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
  }

  delete(req, res, next) {
    let id = req.params.id;
    if (id <= 0 || id >= 1000 || isNaN(id)) {
      res.set('Content-Type', 'text/plain');
      res.status(404).send('Not Found');
    } else {
      let doctor;
      this._doctor
        .where('id', req.params.id)
        .first()
        .then(row => {
          if (!row) {
            return next();
          }

          doctor = row;

          return this._doctor.del().where('id', req.params.id);
        })
        .then(() => {
          delete doctor.id;
          res.json(doctor);
        })
        .catch(err => {
          next(err);
        });
    }
  }
  _bindMethods(methodNames) {
    methodNames.forEach(methodName => {
      this[methodName] = this[methodName].bind(this);
    });
  }
}

module.exports = DoctorsController;
