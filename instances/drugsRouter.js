const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser.json());

const drugsController = require('./drugsController');

router.get('/doctors/:doctorId(\\d+)/drugs', drugsController.getAll);
router.get('/doctors/:doctorId(\\d+)/drugs/:id(\\d+)', drugsController.getOne);
router.post('/doctors/:doctorId(\\d+)/drugs', drugsController.create);
router.patch('/drugs/:id(\\d+)', drugsController.patch);
router.delete('/drugs/:id(\\d+)', drugsController.delete);

module.exports = router;
