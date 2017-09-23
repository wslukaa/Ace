const _ = require('lodash');

module.exports = {
  RLE: (req, res) => {
	const input = req.body;
	data = input.data;
	last = '';
	counter = 0;
	output = "";

	for (var i in data){
	  if (last == data[i])
	  {
		counter ++;
	  }
	  else{
		if (counter > 1) {output += counter.toString ();}
		output += last;
		last = data[i];
		counter = 1;
	  }
	}

	if (counter > 1) output += counter.toString ();
	output += last;

	console.log (output);
	var len = output.length * 8;
	res.end (len.toString ());
  },
  LZW: (req, res) => {
	const input = req.body;
	data = input.data;
	var dict = {};
	dict_counter = 0;

	P = "";
	P = data [0];
	count = 0;

	for (var i = 1; i < data.length; i ++){
	  key = P + data[i];
	  if (key in dict){
		P = key;
	  }
	  else{
		// console.log (key);
		// if (dict_counter <= 4095-256+1){
		  dict [key] = 1;
		  dict_counter += 1;
		// }
		console.log ("Key: " + key);
		count += 1;
		console.log ("P: " + P);
		P = data[i];
	  }
	}
	// count += 1;
	var len = (count) * 12;
	res.end (len.toString())
	dict = {};
  },
  WDE: (req, res) => {
	const input = req.body;
	var data = input.data;
	console.log (data);
	
	var dict = {};
	var dict_counter = 0;
	var count = 0;
	var temp = ""

	for (var i = 0; i < data.length; i ++){
		var charCode = data.charCodeAt (i);
		if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123)){
			temp = temp + data[i];
		}
		else
		{
			dict [temp] = 1;
			if (temp != "")
			{
				temp = "";
				count ++;
			}
			count ++;
		}
	}

	if (temp != "")
	{
		temp = "";
		count ++;
	}

	count *= 12;

	for (var i in dict){
		count += i.length * 8;
	}
	res.end (count.toString ());
	dict = {};
  }
};