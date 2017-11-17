const DoctorsController = require('../controllers/DoctorsController');

module.exports = new DoctorsController({
  doctorTable: 'Doctor'
});
