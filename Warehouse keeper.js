const fetch = require('node-fetch');
const _ = require('lodash');

const dx = [-1, 0, 1, 0];
const dy = [0, -1, 0, 1];

const getStage = (mapA) => {
  const stage = {
    map: [],
    width: mapA[0].length,
    height: mapA.length,
  };
  _.each(mapA, (line, row) => {
    const a = [];
    stage.map.push(a);
    for (let i = 0; i < line.length; i += 1) {
      const c = line.charAt(i);
      if (c === 'b') {
        stage.p0 = {
          x: row,
          y: i,
        };
      }
      a.push(c);
    }
  });
  return stage;
};

const solveStage = (stage) => {
  const {
    map,
    p0,
  } = stage;

  const b = [{
    p: _.cloneDeep(p0),
    from: null,
  }];
  let l = 0, r = 0;

  for (; l <= r; l += 1) {
    const p = _.cloneDeep(b[l].p);
    for (let i = 0; i < 4; i += 1) {
      const p1 = {
        x: p.x + dx[i],
        y: p.y + dy[i],
      };
      if (p1.x < 0 || p1.x >= stage.height || p1.y < 0 || p1.y >= stage.width) continue;
      if (map[p1.x][p1.y] === 'x' || map[p1.x][p1.y] === '-') continue;

    }
  }
}

module.exports = (req, res) => {
  const input = req.body;
  const {
    level,
    run_id,
  } = input;

  console.log(input);

  res.json(233);
};
