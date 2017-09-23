const _ = require('lodash');

const parseTime = (str) => {
  const a = str.split(' ');
  const date = a[0];
  const time = a[1];

  const dateArr = date.split('-');
  const day = dateArr[0];
  const month = dateArr[1];
  const year = dateArr[2];

  let delta = 0;
  if (time.indexOf('+') !== -1) {
    const index = time.indexOf('+');
    delta = -parseInt(time.substr(index + 1)) / 100;
  } else if (time.indexOf('-') !== -1) {
    const index = time.indexOf('-');
    delta = parseInt(time.substr(index + 1)) / 100;
  }
  return new Date(new Date(`${year}-${month}-${day}T${a[1].substr(0, 12)}Z`).getTime() + delta * 60 * 60000);
};

module.exports = (req, res) => {
  const input = req.body;
  const a = input[0].split(';');
  const tasks = [];
  const n = parseInt(a[0]);
  const times = [];
  times.push(parseTime(a[1]).getTime());
  times.push(parseTime(a[2]).getTime());
  for (let i = 1; i <= n; i += 1) {
    const b = input[i].split(';');
    tasks.push({
      name: b[0],
      start: parseTime(b[1]).getTime(),
      end: parseTime(b[2]).getTime(),
    })
    times.push(tasks[tasks.length - 1].start);
    times.push(tasks[tasks.length - 1].end);
  }
  times.sort((A, B) => A - B);

  let max = 0;
  _.each(times, (e, index) => {
    if (!index) return;
    const s = times[index - 1];
    let wFound = false;
    _.each(tasks, (task) => {
      if (s >= task.start && e <= task.end) {
        wFound = true;
        return false;
      }
    });
    if (!wFound) {
      if (e - s > max) {
        max = e - s;
      }
    }
  })

  res.json(`${Math.floor(max / 1000)}`);
};
