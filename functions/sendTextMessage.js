'use strict';

import { FB_MESSAGE_API_URL } from '../constants/';

const sendTextMessage = (recipientId, messageText) => {
    const messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText
        }
    };

    return fetch(`${FB_MESSAGE_API_URL}?access_token=${process.env.FB_PAGE_ACCESS_TOKEN}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.error && data.error.message) {
            throw new Error(data.error.message);
        }
        return data;
    });
};

export default sendTextMessage;
