const _ = require('lodash');

module.exports = function(req, res) {
  var numbers = req.body;

  var result = numbers.sort ()

  res.json(result);
}
