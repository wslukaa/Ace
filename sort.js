module.exports = function(req, res) {
  var points = req.body;
  
  points.sort(function(a, b){return a-b});
  res.json();
}
