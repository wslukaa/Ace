const express = require('express');
const bodyParser = require('body-parser');
const math = require('mathjs');
const _  = require('lodash');

const releaseSchedule = require('./Release Schedule');
var hm = require ("./heistmodule")

const app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
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