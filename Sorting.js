const _ = require('lodash');
var ts = require ('timsort')

module.exports = function (input) {
  var numbers = input;
  var map = {};
  var arr = [];
  var resArr = [];
  var i;

  for (i in numbers){
  	if (numbers [i] in map){
  		map [numbers [i]] += 1;
  	}
  	else{
  		map [numbers [i]] = 1;	
  		arr.push (numbers [i]);
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
  
  return (resArr);
}
