const _ = require('lodash');
const fetch = require('node-fetch');

const runId = '123cddb0-cc63-4d67-8c2d-e8db5940a60d';

const dealWithMessages = (messages) => {
  messages.sort((A, B) => A.messageId - B.messageId);
  return [];
};

module.exports = (req, res) => {
  let messages = [{
    messageId: 1,
    messageType: 'SOD',
    closePrice: {
      '0005.HK': 75,
    },
  }, {
    messageId: 3,
    messageType: 'EOD',
  }, {
    messageId: 2,
    messageType: 'NEW',
    orderId: 'order-1',
    quantity: 1000,
    symbol: '0005.HK',
    side: 'B',
    orderType: 'LMT',
    price: 74.9,
  }];
  const result = dealWithMessages(messages);
  fetch('https://cis2017-mini-exchange.herokuapp.com/evaluate/result', {
    method: 'POST',
    body: {
      runId,
      result,
    },
  })
  .then(result => result.text())
  .then((result) => {
    console.log(result);
    res.json(result);
  });
};
