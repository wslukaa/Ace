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
    if (message.orderType === 'LMT' && typeof message.price !== 'number') return false;
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
      messages.sort((A, B) => A.messageId - B.messageId);
      if (messages[0].messageType !== 'SOD' || messages[messages.length - 1].messageType !== 'EOD') {
        res.json('Invalid messages SOD and EOD');
        return;
      }

      const { closePrice } = messages[0];
      const orders = {};
      const orderArr = [];
      const goods = {};
      _.each(closePrice, (price, symbol) => {
        goods[symbol] = {
          lastPrice: price,
          ordersB: [],
          ordersS: [],
        };
      });
      _.each(messages, (message, index) => {
        if (index === 0 || index === messages.length - 1) return;
        let order;
        if (message.messageType === 'NEW') {
          const { orderId, orderType, quantity, symbol, side, price } = message;
          if (orders[orderId]) return;
          if (!goods[symbol]) return;
          order = {
            orderId,
            orderType,
            quantity: quantity,
            symbol,
            side,
            price: orderType === 'LMT' ? price : goods[symbol].lastPrice,
            openQuantity: quantity,
            state: 'LIVE',
            fills: [],
          };
          orders[orderId] = order;
          if (side === 'B') {
            goods[symbol].ordersB.push(order);
            const target = goods[symbol].ordersB;
            for (let i = target.length - 1; i > 0; i -= 1) {
              if (target[i].price > target[i - 1].price) {
                const swap = target[i];
                target[i] = target[i - 1];
                target[i - 1] = swap;
              } else {
                break;
              }
            }
          } else {
            goods[symbol].ordersS.push(order);
            const target = goods[symbol].ordersS;
            for (let i = target.length - 1; i > 0; i -= 1) {
              if (target[i].price < target[i - 1].price) {
                const swap = target[i];
                target[i] = target[i - 1];
                target[i - 1] = swap;
              } else {
                break;
              }
            }
          }
          orderArr.push(order);
        }
        if (message.messageType === 'QUANTITY') {
          const { orderId, quantity } = message;
          order = orders[orderId];
          if (!order) return;
          if (quantity > 0) {
            if (order.state !== 'LIVE' && order.state !== 'FILLED') return;
            const target = order.side === 'B' ? goods[order.symbol].ordersB : goods[order.symbol].ordersS;
            const index = target.indexOf(order);
            if (index === -1) {
              target.push(order);
              for (let i = target.length - 1; i > 0; i -= 1) {
                if ((order.side === 'B' && target[i].price > target[i - 1].price)
                  || (order.side === 'S' && target[i].price < target[i - 1].price)) {
                  const swap = target[i];
                  target[i] = target[i - 1];
                  target[i - 1] = swap;
                } else {
                  break;
                }
              }
            } else {
              for (let i = index; i < target.length - 1; i += 1) {
                if ((order.side === 'B' && target[i].price === target[i - 1].price)
                  || (order.side === 'S' && target[i].price === target[i - 1].price)) {
                  const swap = target[i];
                  target[i] = target[i + 1];
                  target[i + 1] = swap;
                } else {
                  break;
                }
              }
            }
            order.state = 'LIVE';
            order.quantity += quantity;
            order.openQuantity += quantity;
          } else {
            if (order.state !== 'LIVE') return;
            if (!order.fills.length && order.quantity + quantity <= 0) return;
            const realDelta = order.openQuantity - Math.max(0, order.openQuantity + quantity);
            order.openQuantity -= realDelta;
            order.quantity -= realDelta;
            if (order.openQuantity <= 0) order.state = 'FILLED';
          }
        }
        if (message.messageType === 'PRICE') {
          const { orderId, price } = message;
          order = orders[orderId];
          if (!order) return;
          if (order.state !== 'LIVE') return;
          order.price = price;
          const target = order.side === 'B' ? goods[order.symbol].ordersB : goods[order.symbol].ordersS;
          const index = target.indexOf(order);
          target = [...target.slice(0, index), target.slice(index + 1)];
          target.push(order);
          for (let i = target.length - 1; i > 0; i -= 1) {
            if ((order.side === 'B' && target[i].price > target[i - 1].price)
              || (order.side === 'S' && target[i].price < target[i - 1].price)) {
              const swap = target[i];
              target[i] = target[i - 1];
              target[i - 1] = swap;
            } else {
              break;
            }
          }
        }
        if (message.messageType === 'CANCEL') {
          const { orderId } = message;
          order = orders[orderId];
          if (!order) return;
          if (order.state !== 'LIVE') return;
          order.state = 'CANCELLED';
          order.openQuantity = 0;
        }

        const good = goods[order.symbol];
        let { ordersB, ordersS } = good;
        for (; ordersB.length && ordersS.length && (ordersB[0].orderType === 'MKT' || ordersS[0].orderType === 'MKT' || ordersB[0].price >= ordersS[0].price);) {
          const ob = ordersB[0];
          const os = ordersS[0];
          let price;
          if (ob.orderType === 'MKT' && os.orderType === 'MKT') {
            price = Math.min(ob.price, oc.price);
            ob.price = price;
            os.price = price;
          } else if (ob.orderType === 'MKT' || os.orderType === 'MKT') {
            if (ob.orderType === 'MKT') {
              price = os.price;
              ob.price = price;
            } else {
              price = ob.price;
              os.price = price;
            }
          } else {
            price = -1;
          }
          const quantity = Math.min(ob.openQuantity, os.openQuantity);
          ob.fills.push({
            orderId: os.orderId,
            price: price !== -1 ? price : ob.price,
            quantity,
          });
          os.fills.push({
            orderId: ob.orderId,
            price: price !== -1 ? price : os.price,
            quantity,
          });
          ob.openQuantity -= quantity;
          os.openQuantity -= quantity;
          if (ob.openQuantity <= 0) {
            ob.state = 'FILLED';
            good.ordersB = good.ordersB.slice(1);
            ordersB = good.ordersB;
          }
          if (os.openQuantity <= 0) {
            os.state = 'FILLED';
            good.ordersS = good.ordersS.slice(1);
            ordersS = good.ordersS;
          }
        }
      });

      _.each(orderArr, (order) => {
        delete order.orderType;
        if (!order.fills.length) delete order.fills;
      });

      fetch('https://cis2017-mini-exchange.herokuapp.com/evaluate/result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          runId,
          result: orderArr,
        },
      })
      .then(() => {
        res.json(orderArr);
      });
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
