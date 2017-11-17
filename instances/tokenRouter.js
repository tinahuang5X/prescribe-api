const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser.json());

const tokenController = require('./tokenController');

router.post('/token', tokenController.create);

router.delete('/token', tokenController.delete);

module.exports = router;
