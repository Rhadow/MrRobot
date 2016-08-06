'use strict';

import wit, { findOrCreateSession, getSessionContext, setSessionContext } from './witUtilities';
import sendTextMessage from './sendTextMessage';
import { getDBClient } from './redisClient';

const receivedMessage = (event) => {
    const redisClient = getDBClient();
    const senderId = event.sender.id;
    const messageText = event.message.text;
    const messageAttachments = event.message.attachments;
    const sessionId = findOrCreateSession(senderId);

    if (messageText) {
        wit.runActions(
            sessionId,
            messageText,
            getSessionContext(sessionId)
        ).then((context) => {
            setSessionContext(sessionId, context);
        });
        // if (messageText === 'set') {
        //     redisClient.set('some key', 'some val');
        //     sendTextMessage(senderId, 'redis set!');
        // } else if (messageText === 'get') {
        //     redisClient.get('some key', (err, reply) => {
        //         if (err) {
        //             sendTextMessage(senderId, `redis get failed: ${err.toString()}`);
        //         } else {
        //             if (reply) {
        //                 sendTextMessage(senderId, `redis says: ${reply.toString()}`);
        //             } else {
        //                 sendTextMessage(senderId, 'redis says: Key is missing');
        //             }
        //         }
        //     });
        // } else if (messageText === 'del') {
        //     redisClient.del('some key');
        //     sendTextMessage(senderId, 'redis deleted key!');
        // } else {
        //     sendTextMessage(senderId, `Echo: ${messageText}`);
        // }
    } else if (messageAttachments) {
        sendTextMessage(senderId, 'Message with attachment received!');
    }
};

export default receivedMessage;
