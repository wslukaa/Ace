const fetch = require('node-fetch');
const mongo = require('mongodb-bluebird');
const _ = require('lodash');

const checkDot = (obj) => {
  if (typeof obj !== 'object') return;
  _.each(Object.keys(obj), (key) => {
    if (typeof obj[key] === 'object') checkDot(obj[key]);
    if (key.indexOf('.') !== -1) {
      obj[key.replace('.', 'u002e')] = obj[key];
      delete obj[key];
    }
  });
};

const recoverDot = (obj) => {
  if (typeof obj !== 'object') return;
  _.each(Object.keys(obj), (key) => {
    if (typeof obj[key] === 'object') recoverDot(obj[key]);
    if (key.indexOf('u002e') !== -1) {
      obj[key.replace('u002e', '.')] = obj[key];
      delete obj[key];
    }
  });
};

const checkMessage = (message) => {
  if (typeof message.messageId !== 'number') return false;
  const type = message.messageType;
  if (['SOD', 'NEW', 'QUANTITY', 'PRICE', 'CANCEL', 'EOD'].indexOf(type) === -1) return false;
  if (type === 'SOD') {
    if (!message.closePrice) return false;
  }
  if (type === 'NEW') {
    if (!message.orderId) return false;
    if (typeof message.quantity !== 'number') return false;
    if (message.quantity <= 0) return false;
    if (typeof message.symbol !== 'string') return false;
    if (message.side !== 'B' && message.side !== 'S') return false;
    if (message.orderType !== 'LMT' && message.orderType !== 'MKT') return false;
    if (typeof message.price !== 'number') return false;
  }
  if (type === 'QUANTITY') {
    if (!message.orderId) return false;
    if (typeof message.quantity !== 'number') return false;
  }
  if (type === 'PRICE') {
    if (!message.orderId) return false;
    if (typeof message.price !== 'number') return false;
  }
  if (type === 'CANCEL') {
    if (!message.orderId) return false;
  }
  return true;
};

module.exports = (req, res) => {
  const message = req.body;

  if (message.type === 'clean') {
    mongo.connect('mongodb://wufan:123456@ds141434.mlab.com:41434/codeitsuisse')
    .then((mongo) => {
      const Message = mongo.collection('message');
      return Message.remove(message);
    })
    .then(() => {
      res.json('');
    })
    .catch((err) => {
      console.log(err);
      res.json('');
    });
    return;
  }

  if (typeof message.runId === 'string') {
    const runId = message.runId;

    mongo.connect('mongodb://wufan:123456@ds141434.mlab.com:41434/codeitsuisse')
    .then((mongo) => {
      const Message = mongo.collection('message');
      return Message.find();
    })
    .then((messagesA) => {
      const messages = [];
      _.each(messagesA, (message) => {
        recoverDot(message);
        if (!checkMessage(message)) return;
        messages.push(message);
      });
      console.log(message);
      messages.sort((A, B) => A.messageId - B.messageId);
      if (messages[0].messageType !== 'SOD' || messages[messages.length - 1].messageType !== 'EOD') {
        res.json('Invalid messages SOD and EOD');
        return;
      }
      console.log(messages);

      const { closePrice } = messages[0];
      _.each(messages, (message, index) => {
        if (index === 0 || index === messages.length) return;
      });

      res.json('');
    })
    .catch((err) => {
      console.log(err);
      res.json('');
    });
    return;
  }

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
};
