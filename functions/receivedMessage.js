'use strict';

const sendTextMessage = require('./sendTextMessage');
const redisClient = require('./redisClient').getClient();

const receivedMessage = (event) => {
    const senderId = event.sender.id;
    const recipientId = event.recipient.id;
    const timeOfMessage = event.timestamp;
    const message = event.message;
    const messageId = message.mid;
    const messageText = message.text;
    const messageAttachments = message.attachments;

    console.log(`Received message for user ${senderId} and page ${recipientId} at ${new Date(timeOfMessage)} with message: ${JSON.stringify(message)}`);

    if (messageText) {
        if (messageText === 'set') {
            redisClient.set('some key', 'some val');
            sendTextMessage(senderId, 'redis set!');
        } else if (messageText === 'get') {
            redisClient.get('some key', (err, reply) => {
                console.log(reply);
                // if (err) {
                //     sendTextMessage(senderId, `redis get failed: ${err.toString()}`);
                // } else {
                //     sendTextMessage(senderId, `redis says: ${reply.toString()}`);
                // }
            });
        } else if (messageText === 'del') {
            redisClient.del('some key');
            sendTextMessage(senderId, 'redis deleted key!');
        } else {
            sendTextMessage(senderId, `Echo: ${messageText}`);
        }
    } else if (messageAttachments) {
        sendTextMessage(senderId, 'Message with attachment received!');
    }
};

module.exports = receivedMessage;
