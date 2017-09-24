const fetch = require('node-fetch');
const mongo = require('mongodb-bluebird');
const _ = require('lodash');

const runId = '123cddb0-cc63-4d67-8c2d-e8db5940a60d';

const dealWithMessages = (messages) => {
  messages.sort((A, B) => A.messageId - B.messageId);
  return [{
    "orderId": "order-1",
    "quantity": 1000,
    "symbol": "0005.HK",
    "side": "B",
    "price": 74.9,
    "openQuantity": 1000,
    "state": "LIVE",
    "fills": [],
  }];
};

const checkDot = (obj) => {
  if (typeof obj !== 'object') return;
  _.each(Object.keys(obj), (key) => {
    if (typeof obj[key] === 'object') checkDot(obj[key]);
    if (key.indexOf('.') !== -1) {
      obj[key.replace('.', '\u002e')] = obj[key];
      delete obj[key];
    }
  });
}

module.exports = (req, res) => {
  const message = req.body;
  checkDot(message);
  console.log(message);

  mongo.connect('mongodb://wufan:123456@ds141434.mlab.com:41434/codeitsuisse')
  .then((mongo) => {
    const Message = mongo.collection('message');
    return Message.insert(message);
  })
  .then(() => {
    res.json('');
  })
  .catch((err) => {
    console.log(err);
    res.json('');
  });
  /*
  const result = dealWithMessages(messages);
  fetch('https://cis2017-mini-exchange.herokuapp.com/evaluate/result', {
    method: 'POST',
    body: JSON.stringify({
      runId,
      result,
    }),
  })
  .then(result => result.text())
  .then((result) => {
    console.log(result);
    res.json(result);
  });
  */
};
