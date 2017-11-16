const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser.json());

const doctorsController = require('../controllers/doctorsController');

router.get('/doctors', doctorsController.getAll);
router.get('/doctors/:id', doctorsController.getOne);
router.post('/doctors', doctorsController.create);
router.patch('/doctors/:id', doctorsController.patch);
router.delete('/doctors/:id', doctorsController.delete);

module.exports = router;
