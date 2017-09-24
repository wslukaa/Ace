const express = require('express');
const bodyParser = require('body-parser');
const math = require('mathjs');
const _  = require('lodash');

const sort = require('./Sorting');
const trainPlanner =require('./trainPlanner');
const releaseSchedule = require('./Release Schedule');
const hm = require ("./heistmodule")
const hr = require ('./hrModule')

const stringCompression = require('./String Compression');
const stringComp = require ('./StringCompression2');

const calculateEmptyArea = require('./Calculate Empty Area');

const miniExchange = require('./Mini Exchange');

const warehouseKeeper = require('./Warehouse keeper');

const app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

var jsonParser = bodyParser.json({
  limit: '50mb',
});

// app.use(bodyParser.json({
//   limit: '50mb',
// }));
// app.use (bodyParser.urlencoded({
//   extended: true,
// }));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.post('/test', function(req, res) {
  res.json({
    aa: 233,
  });
});

app.post('/determinant', jsonParser, function(req, res) {
  let matrix = math.matrix(req.body);
  res.json(math.det(matrix));
});

app.post('/heist', jsonParser,function (req, res){
	res.json (hm.grab (req.body));
});
app.post('/releaseSchedule', jsonParser, releaseSchedule);

var storage = ""
app.post ('/horse-racing', jsonParser, function (req, res, next){
  if (storage == ""){
    storage = req.body;
  }
	res.json (hr.result (req.body));
});

app.post ('/getData', jsonParser, function (req, res, next){
  res.json (storage);
});

app.post('/trainPlanner',jsonParser, trainPlanner);

app.post('/sort', function (req, res, next){
  var data = '';
  var last = 0;
  var negative = false;
  var arr = [];
  var lastestArr = [];

  req.on( 'data', function( chunk ) {
    console.log (typeof chunk);
    console.log (chunk.length);

    var temp = [];
    for (var i in chunk){
      var num = chunk [i] - 48;
      // console.log (num);
      if (num == -3){
        negative = true;
        continue;
      }
      if (num >= 0 && num <= 9){
        last = last * 10 + num;
        continue;
      }
      if (num == -4 || num == 45){
          if (negative) {temp.push (-1 * last);} else {temp.push (last);}
          negative = false;
          last = 0;
        }
        continue;
      }

      if (arr.length == 0){
        // arr = temp;
        arr = temp;
      }
      else
      {
        lastestArr = temp;
      }

      console.log ("117: " + arr.toString ());
      console.log ("118: " + lastestArr.toString ());

      if (lastestArr.length == 0)
      {
        arr = sort.result (arr);
      }
      else
      {
        var index = 0;
        while (index < lastestArr.length){

          var left = -1;
          var right = arr.length;
          var pivot = Math.floor (arr.length / 2);

          // if (lastestArr [index] < arr [0]){
          //   arr.shift (lastestArr [index]);
          //   index ++;
          //   continue;
          // }

          // if (lastestArr [index] > arr [arr.length - 1]){
          //   arr.push (lastestArr [index]);
          //   index ++;
          //   continue;
          // }

          
          while (true){

            console.log ("" + index + " " + left + " " + right + " " + pivot);

            if (lastestArr [index] < arr [pivot]){
              right = pivot;
              if (right == left + 1){
                pivot = right;
                break;
              }
              pivot = Math.floor ((left + pivot) / 2);
              continue;
            }
            if (lastestArr [index] > arr [pivot]){
              left = pivot;
              if (right == left + 1){
                pivot = left + 1;
                break;
              }
              pivot = Math.floor ((right + pivot) / 2);
              continue;
            }
            break;
          }

          arr.splice (pivot, 0, lastestArr [index])
          console.log (arr.toString ());

          index ++;
          }
        }

    console.log ("Hello?");
    console.log (arr.toString());

    // if (chunk [0] == '['){
    //   chunk.shift ();
    // }
    // if (chunk [chunk.length -1] == ']'){
    //   chunk.pop ();
    // }
    // data += chunk;
    // console.log (data);
  });

  req.on( 'end', function() {
    // req.rawBody = data;
    // console.log( 'on end: ', data )
    // if ( data && data.indexOf( '{' ) > -1 ) {
    //   req.body = JSON.parse( data );
    // }
    // next();
    res.json (arr);
  });
});

app.post('/releaseSchedule', jsonParser, releaseSchedule);

// app.post('/stringcompression/RLE', stringCompression.RLE);
app.post('/stringcompression/RLE', jsonParser, stringComp.RLE);
app.post('/stringcompression/LZW', jsonParser, stringComp.LZW);
app.post('/stringcompression/WDE', jsonParser, stringComp.WDE);

app.post('/calculateemptyarea', jsonParser, calculateEmptyArea);

app.post('/mini-exchange', jsonParser, miniExchange);

app.post('/warehouse-keeper/game-start', jsonParser, warehouseKeeper);
