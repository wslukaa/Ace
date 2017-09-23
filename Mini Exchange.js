const _ = require('lodash');

const dealWithMessages = (messages) => {
  messages.sort((A, B) => A.messageId - B.messageId);
};

module.exports = (req, res) => {
  const input = req.body;
  console.log(input);
};
