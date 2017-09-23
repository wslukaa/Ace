module.exports = function(req, res) {
  var numbers = req.body;

  numbers.sort(function(a, b) {
    return a - b;
  });
  res.json(numbers);
}
