const _ = require('lodash');

module.exports = function(req, res) {
  var numbers = req.body;

  const a = [];
  for (let i = -10000; i <= 10000; i += 1) a[i] = 0;
  _.each(numbers, (number) => {
    a[number] += 1;
  });

  let str = '';
  for (let i = -10000; i <= 10000; i += 1) {
    str += `,${a[i]}`;
  }

  if (numbers.length >= 5000000) console.log(str);

  res.json([]);
}
