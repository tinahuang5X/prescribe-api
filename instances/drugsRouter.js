const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser.json());

const drugsController = require('./drugsController');

router.get('/doctors/:doctorId/drugs', drugsController.getAll);
router.get('/doctors/:doctorId/drugs/:id', drugsController.getOne);
router.post('/doctors/:doctorId/drugs', drugsController.create);
router.patch('/drugs/:id', drugsController.patch);
router.delete('/drugs/:id', drugsController.delete);

module.exports = router;
