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
        dict [key] = 1;
        console.log ("Key: " + key);
        count += 1;
        console.log ("P: " + P);
        P = data[i];
      }
    }
    count += 1;
    var len = (count) * 12;
    res.end (len.toString())
    dict = {};
  }
};