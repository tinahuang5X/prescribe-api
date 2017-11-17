//const express = require('express');

//const router = express.Router();
const knex = require('../knex');
const jwt = require('jsonwebtoken');

class DrugsController {
  constructor({ drugTable }) {
    this._drug = knex(drugTable);
    this._bindMethods(['getAll', 'getOne', 'create', 'patch', 'delete']);
  }

  getAll(req, res, next) {
    //try {
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
      this._drug
        .where('doctorId', theDoctorId)
        //.first()
        .then(drugs => {
          if (!drugs) {
            res.set('Content-Type', 'text/plain');
            res.status(404).send('Drug Not Found');
          }
          //console.log(drugs);
          res.json(drugs);
        })
        .catch(err => {
          next(err);
        });
    }
  }
  //   catch (e) {
  //     throw new Error('oops');
  //   }
  // }

  getOne(req, res, next) {
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
        this._drug
          .where('doctorId', theDoctorId)
          .first()
          .then(drug => {
            if (!drug) {
              res.set('Content-Type', 'text/plain');
              res.status(404).send('Drug Not Found');
            }

            res.json(drug);
          })
          .catch(err => {
            next(err);
          });
      }
    }
  }
  create(req, res, next) {
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
        this._drug
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
          .then(drugs => {
            //console.log(drugs);
            res.json(drugs[0]);
          })
          .catch(err => {
            //console.log('this is the err', err);
            next(err);
          });
      }
    }
  }
  patch(req, res, next) {
    let id = req.params.id;
    if (id <= 0 || id >= 1000 || isNaN(id)) {
      res.set('Content-Type', 'text/plain');
      res.status(404).send('Not Found');
    } else {
      this._drug
        .where('id', req.params.id)
        .first()
        // .then(drug => {
        //   if (!drug) {
        //     return next();
        //   }
        .then(drug => {
          return this._drug
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
        .then(drugs => {
          res.json(drugs[0]);
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
      let drug;
      this._drug
        .where('id', req.params.id)
        .first()
        .then(row => {
          if (!row) {
            return next();
          }

          drug = row;

          return this._drug.del().where('id', req.params.id);
        })
        .then(() => {
          delete drug.id;
          res.json(drug);
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

module.exports = DrugsController;
