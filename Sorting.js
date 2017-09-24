const _ = require('lodash');

module.exports = function(req, res) {
  var numbers = req.body;

  console.log (numbers);
  var result = numbers.sort (function (a,b) {return a - b;});
  console.log (result);
  res.json(result);
}
