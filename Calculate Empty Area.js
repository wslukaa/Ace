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
    const r = {};
    if (rectangle) {
      r.x0 = rectangle.coordinate.X;
      r.y0 = rectangle.coordinate.Y;
      r.x1 = r.x0 + rectangle.width;
      r.y1 = r.y0 + rectangle.height;
      r.s = rectangle.width * rectangle.height;
    } else {
      r.x0 = square.coordinate.X;
      r.y0 = square.coordinate.Y;
      r.x1 = r.x0 + square.width;
      r.y1 = r.y0 + square.width;
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

  if (circle) {
    const c = {
      x: circle.center.X,
      y: circle.center.Y,
      r: circle.radius,
    };
    c.x0 = c.x - c.r;
    c.x1 = c.x + c.r;
    c.y0 = c.y - c.r;
    c.y1 = c.y + c.r;
    if (c.x1 <= x0 || c.x0 >= x1 || c.y1 <= y0 || c.y0 >= y1) {
      res.json(s);
      return;
    }
    if (c.x0 >= x0 && c.x1 <= x1 && c.y0 >= y0 && c.y1 <= y1) {
      res.json(Math.round((s - Math.PI * c.r * c.r) * 100) / 100);
      return;
    }


  res.json(s);
<<<<<<< HEAD
};}
=======
};
}
>>>>>>> c93d60c397c4337ecd3ec3de8d439379988f32a0
