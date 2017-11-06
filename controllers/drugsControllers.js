exports.index = function(req, res) {
  res.send('NOT IMPLEMENTED: Site Home Page');
};

// Display list of all books
exports.drug_list = function(req, res) {
  res.send('NOT IMPLEMENTED: Drug list');
};

// Display detail page for a specific book
exports.drug_detail = function(req, res) {
  res.send('NOT IMPLEMENTED: Drug detail: ' + req.params.id);
};
