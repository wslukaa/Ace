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

app.use(bodyParser.json({
  limit: '50mb',
}));
app.use (bodyParser.urlencoded({
  extended: true,
}));

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

app.post('/determinant', function(req, res) {
  let matrix = math.matrix(req.body);
  res.json(math.det(matrix));
});

app.post('/heist', function (req, res){
	res.json (hm.grab (req.body));
});
app.post('/releaseSchedule', releaseSchedule);

var storage = ""
app.post ('/horse-racing', function (req, res, next){
  if (storage == ""){
    storage = req.body;
  }
	res.json (hr.result (req.body));
});

app.post ('/getData', function (req, res, next){
  res.json (storage);
});

app.post('/trainPlanner',trainPlanner);

app.post('/sort', function (req, res, next){
  if (storage == "") {
    storage = req.body;
  }
  res.json (sort (req.body));
});

app.post('/releaseSchedule', releaseSchedule);

// app.post('/stringcompression/RLE', stringCompression.RLE);
app.post('/stringcompression/RLE', stringComp.RLE);
app.post('/stringcompression/LZW', stringComp.LZW);
app.post('/stringcompression/WDE', stringComp.WDE);

app.post('/calculateemptyarea', calculateEmptyArea);

app.post('/mini-exchange', miniExchange);

app.post('/warehouse-keeper/game-start', warehouseKeeper);
