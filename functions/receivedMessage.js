'use strict';

import sendTextMessage from './sendTextMessage';
import { getDBClient } from './redisClient';
const redisClient = getDBClient();

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
                if (err) {
                    sendTextMessage(senderId, `redis get failed: ${err.toString()}`);
                } else {
                    if (reply) {
                        sendTextMessage(senderId, `redis says: ${reply.toString()}`);
                    } else {
                        sendTextMessage(senderId, 'redis says: Key is missing');
                    }
                }
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

export default receivedMessage;
