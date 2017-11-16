//const express = require('express');

//const router = express.Router();
const knex = require('../knex');
const jwt = require('jsonwebtoken');

class drugsController {
  getAll(req, res, next) {
    try {
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
        knex('Drug')
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
    } catch (e) {
      throw new Error('oops');
    }
  }
}

module.exports = drugsController;
