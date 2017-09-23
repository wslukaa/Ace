const _ = require('lodash');

module.exports = (req, res) => {
  const input = req.body;
  const {
    container,
    rectangle,
    square,
    circle,
  } = input;

  const x0 = container.coordinate.X;
  const y0 = container.coordinate.Y;
  const x1 = x0 + container.width;
  const y1 = y0 + container.height;
  const s = container.width * container.height;

  if (rectangle || square) {
    const r = {
      x0: rectangle.coordinate.X,
      y0: rectangle.coordinate.Y,
    };
    if (rectangle) {
      r.x1 = r.x0 + rectangle.width;
      r.y1 = r.y0 + rectangle.height;
      r.s = rectangle.width * rectangle.height;
    } else {
      r.x1 = r.x0 + square.width;
      r.y0 = r.y0 + square.width;
      r.s = square.width * square.width;
    }
    const minX = Math.max(x0, r.x0);
    const minY = Math.max(y0, r.y0);
    const maxX = Math.min(x1, r.x1);
    const maxY = Math.min(y1, r.y1);
    if (minX < maxX && minY < maxY) {
      res.json(s - (maxX - minX) * (maxY - minY));
      return;
    } else {
      res.json(s);
      return;
    }
  }

  res.json(s);
};
