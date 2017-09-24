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
   if (c.x == x0 &&c.y1<=y1&&c.y0>=y0||  c.x == x1 && c.y1<=y1&&c.y0>=y0  || c.y==y1 && c.x0>=x0 && c.x1<=x1||c.y==y0 && c.x0>=x0 && c.x1<=x1){
        res.json(Math.round((s - Math.PI * c.r * c.r/2) * 100) / 100);
    return;
  }
 if (c.x == x0 && c.y >=y0 &&c.y<=y1&&c.x1<=x1||  c.x == x0 && c.y==y1&&c.x1<=x1&&c.y0>=y0  || c.x==x1 && c.y==y0 && c.x0>=x0&&c.y1<=y1||c.y0>=y0&&c.x0>=x0&& c.x==x1 && c.y==y1){
        res.json(Math.round((s - Math.PI * c.r * c.r/4) * 100) / 100);
    return;
  }
function find_angle(Ax,Ay,Bx,By,Cx,Cy) {
    var AB = Math.sqrt(Math.pow(Bx-Ax,2)+ Math.pow(By-Ay,2));    
    var BC = Math.sqrt(Math.pow(Bx-Cx,2)+ Math.pow(By-Cy,2)); 
    var AC = Math.sqrt(Math.pow(Cx-Ax,2)+ Math.pow(Cy-Ay,2));
    return Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));
}
   if (c.x0 > x0 && c.x1<x1 && c.y < y0 && c.y1 > y0 && c.y1 < y1){
     var AX = Math.sqrt(c.r*c.r-(y0-c.y)*(y0-c.y));
     var area_traingle = AX*(y0-c.y);
     var angle= find_angle(c.x-AX,y0,c.x,c.y,c.x+AX,y0);
     res.json(s-(Math.round((Math.PI * c.r * c.r*angle/(2*Math.PI)) * 100) / 100-area_traingle));
    return;
  }
    if (c.x0 > x0 && c.x1<x1 && c.y > y1 && c.y0 < y1 && c.y0>y0){
     var AX = Math.sqrt(c.r*c.r-(c.y-y1)*(c.y-y1));
     var area_traingle = AX*(c.y-y1);
     var angle= find_angle(c.x-AX,y1,c.x,c.y,c.x+AX,y1);
     res.json(s-(Math.round((Math.PI * c.r * c.r*angle/(2*Math.PI)) * 100) / 100-area_traingle));
    return;
  }
      if (c.x < x0 && c.x1>x0 && c.y0 > y0 && c.y1 < y1 && c.x1<x1){
     var AX = Math.sqrt(c.r*c.r-(x0-c.x)*(x0-c.x));
     var area_traingle = AX*(x0-c.x);
     var angle= find_angle(x0,c.y+AX,c.x,c.y,x0,c.y-AX);
     res.json(s-(Math.round((Math.PI * c.r * c.r*angle/(2*Math.PI)) * 100) / 100-area_traingle));
    return;
  }
    
      if (c.x > x1 && c.x0>x0 && c.y0 > y0 && c.y1 < y1 &&c.x0<x1 ){
     var AX = Math.sqrt(c.r*c.r-(c.x-x1)*(c.x-x1));
     var area_traingle = AX*(c.x-x1);
     var angle= find_angle(x1,c.y+AX,c.x,c.y,x1,c.y-AX);
     res.json(s-(Math.round((Math.PI * c.r * c.r*angle/(2*Math.PI)) * 100) / 100-area_traingle));
    return;
  }
     if (c.x0 > x0 && c.x1<x1 && c.y > y0 && c.y1 < y1&&c.y0<y0){
     var AX = Math.sqrt(c.r*c.r-(c.y-y0)*(c.y-y0));
     var area_traingle = AX*(c.y-y0);
     var angle= find_angle(c.x-AX,y0,c.x,c.y,c.x+AX,y0);
     res.json(s-(Math.PI * c.r * c.r-(Math.round((Math.PI * c.r * c.r*angle/(2*Math.PI)) * 100) / 100-area_traingle)));
    return;
  }
      if (c.x0 > x0 && c.x1<x1 && c.y < y1 && c.y1 > y1 && c.y0>y0){
     var AX = Math.sqrt(c.r*c.r-(c.y-y1)*(c.y-y1));
     var area_traingle = AX*(c.y-y1);
     var angle= find_angle(c.x-AX,y1,c.x,c.y,c.x+AX,y1);
     res.json(s-(Math.PI * c.r * c.r-(Math.round((Math.PI * c.r * c.r*angle/(2*Math.PI)) * 100) / 100-area_traingle)));
    return;
  }
     if (c.x > x0 && c.x1<x1 && c.y1 < y1 && c.y0 > y0 && c.x0<x0){
     var AX = Math.sqrt(c.r*c.r-(x0-c.x)*(x0-c.x));
     var area_traingle = AX*(x0-c.x);
     var angle= find_angle(x0,c.y+AX,c.x,c.y,x0,c.y-AX);
     res.json(s-(Math.PI * c.r * c.r-(Math.round((Math.PI * c.r * c.r*angle/(2*Math.PI)) * 100) / 100-area_traingle)));
    return;
  }
      if (c.x < x1 && c.x0>x0 && c.y0 > y0 && c.y1 < y1 &&c.x1>x1 ){
     var AX = Math.sqrt(c.r*c.r-(x1-c.x)*(x1-c.x));
     var area_traingle = AX*(x1-c.x);
     var angle= find_angle(x1,c.y+AX,c.x,c.y,x1,c.y-AX);
     res.json(s-(Math.PI * c.r * c.r-(Math.round((Math.PI * c.r * c.r*angle/(2*Math.PI)) * 100) / 100-area_traingle)));
    return;
  }
     if (c.x > x1 && c.y<y0 && c.y1 < y1 && c.y1 > y0 && c.x0<x1 && c.x0>x0){
     var AX1= Math.sqrt(c.r*c.r-(c.x-x1)*(c.x-x1))-(y0-c.y);
     var AX2=Math.sqrt(c.r*c.r-(y0-c.y)*(y0-c.y))-(c.x-x1);
     var area_traingle1 = AX1*(c.x-x1)/2;
     var area_traingle2 = AX2*(y0-c.y)/2;
     var angle= find_angle(x1,y0+AX1,c.x,c.y,x1-AX2,y0);
     res.json(s-(Math.round((Math.PI * c.r * c.r*angle/(2*Math.PI)) * 100) / 100-area_traingle1-area_traingle2));
    return;
  }
      if (c.x > x1 && c.y>y1 && c.y0 > y0 && c.y0 < y1 &&c.x0<x1 && c.x0>x0){
     var AX1= Math.sqrt(c.r*c.r-(c.x-x1)*(c.x-x1))-(c.y-y1);
     var AX2=Math.sqrt(c.r*c.r-(c.y-y1)*(c.y-y1))-(c.x-x1);
     var area_traingle1 = AX1*(c.x-x1)/2;
     var area_traingle2 = AX2*(c.y-y1)/2;
     var angle= find_angle(x1-AX2,y1,c.x,c.y,x1,y1-AX2);
     res.json(s-(Math.round((Math.PI * c.r * c.r*angle/(2*Math.PI)) * 100) / 100-area_traingle1-area_traingle2));
    return;
  }
     if (c.x < x0 && c.y<y0 && c.y1 < y1 && c.y0 > y0 && c.x1<x1 && c.x1>x0){
     var AX1= Math.sqrt(c.r*c.r-(y0-c.y)*(y0-c.y))-(x0-c.x);
     var AX2=Math.sqrt(c.r*c.r-(x0-c.x)*(x0-c.x))-(y0-c.y);
     var area_traingle1 = AX1*(y0-c.y)/2;
     var area_traingle2 = AX2*(x0-c.x)/2;
     var angle= find_angle(x1,y0+AX1,c.x,c.y,x1-AX2,y0);
     res.json(s-(Math.round((Math.PI * c.r * c.r*angle/(2*Math.PI)) * 100) / 100-area_traingle1-area_traingle2));
    return;
  }
  res.json(s);
};}
