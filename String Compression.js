const _ = require('lodash');

module.exports = {
  RLE: (req, res) => {
    const input = req.body;
    const { data } = input;
    let ret = '';
    let cc = '';
    let num = 0;
    for (let i = 0; i < data.length; i += 1) {
      const c = data.charAt(i);
      if (c !== cc && num) {
        ret += `${num > 1 ? num : ''}${cc}`;
        num = 0;
      }
      cc = c;
      num += 1;
    }
    if (num !== 0) ret += `${num > 1 ? num : ''}${cc}`;
    res.json(8 * ret.length);
  },
  LZW: (req, res) => {
    const input = req.body;
    const { data } = input;
    const lib = {};
    let ret = 0;
    let p = '';
    for (let i = 0; i < data.length; i += 1) {
      const c = data.charAt(i);
      if (lib[`${p}${c}`]) {
        p += c;
      } else {
        lib[`${p}${c}`] = true;
        ret += 1;
        p = c;
      }
    }
    res.json(12 * ret);
  },
  WDE: (req, res) => {
    const input = req.body;
    const { data } = input;
    const lib = {};
    let p = '';
    let wordN = 0;
    for (let i = 0; i < data.length; i += 1) {
      const c = data.charAt(i);
      if (c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z') {
        p += c;
      } else {
        if (p.length) {
          lib[p] = true;
          wordN += 1;
        }
        wordN += 1;
        p = '';
      }
    }
    if (p.length) {
      lib[p] = true;
      wordN += 1;
    }
    let ret = wordN * 12;
    _.each(lib, (a, word) => {
      ret += word.length * 8;
    });
    res.json(ret);
  },
};
