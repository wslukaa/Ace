const _ = require('lodash');
var ts = require ('timsort')

module.exports = function(req, res) {
  var numbers = req.body;
  var map = {};
  var arr = [];
  var resArr = [];
  var i;

  for (i in req.body){
  	if (req.body [i] in map){
  		map [req.body [i]] += 1;
  	}
  	else{
  		map [req.body [i]] = 1;	
  		arr.push (req.body [i]);
  	}
  }
  console.log (i);
  if (i > 999998){
  	console.log (numbers);
  }


  function compareNumbers (a, b){
  	return a-b;
  }

  ts.sort (arr, compareNumbers);

  for (var i in arr){
  	var j;
  	var num = arr [i];
  	for (j = 0; j < map [num]; j++)
  		{
  			resArr.push (num);
  		}
  }
  res.json(resArr);
}
