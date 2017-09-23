module.exports = function(req, res) {
  var input = req.body;
  var people = input;
  people = people.sort(function(a, b) {
      if (asc) {
          return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
      } else {
          return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
      }
  });
  showResults();
  res.json();
}
