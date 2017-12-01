const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser.json());

const doctorsController = require('./doctorsController');

router.get('/doctors', doctorsController.getAll);
router.get('/doctors/:id(\\d+)', doctorsController.getOne);
router.post('/doctors', doctorsController.create);
router.patch('/doctors/:id(\\d+)', doctorsController.patch);
router.delete('/doctors/:id(\\d+)', doctorsController.delete);

module.exports = router;
