const DrugsController = require('../controllers/DrugsController');

module.exports = new DrugsController({
  drugTable: 'Drug'
});
