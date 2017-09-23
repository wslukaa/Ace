module.exports = function(req, res) {
  var numbers = req.body;

  numbers.sort(function(a, b) {
    return a - b;
  });
  console.log(numbers);
  res.json(numbers);
}
