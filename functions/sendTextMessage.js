'use strict';

const CONSTANTS = require('../constants/');

const sendTextMessage = (recipientId, messageText) => {
    const messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText
        }
    };

    fetch(`${CONSTANTS.FB_MESSAGE_API_URL}?access_token=${process.env.FB_PAGE_ACCESS_TOKEN}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
    }).then((res) => {
        if (res.status >= 400) {
            let error = new Error(res.statusText);
            error.response = res;
            throw error;
        } else {
            return res.json();
        }
    }).then((data) => {
        const recipientId = data['recipient_id'];
        const messageId = data['message_id'];
        console.log(`Successfully sent message with id ${messageId} to recipient ${recipientId}`);
    }).catch((error) => {
        console.error('request failed', error);
    });
};

module.exports = sendTextMessage;
