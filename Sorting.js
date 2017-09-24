const _ = require('lodash');
var ts = require ('timsort')

module.exports = function(req, res) {
  var numbers = req.body;

  function compareNumbers (a, b){
  	return a-b;
  }

  console.log (numbers);
  ts.sort (numbers, compareNumbers);
  console.log (numbers);
  res.json(numbers);
}
