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

    fetch({
        uri: CONSTANTS.FB_MESSAGE_API_URL,
        qs: { access_token: process.env.FB_PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: messageData
    }).then((res) => {
        if (res.status >= 400) {
            console.error('Unable to send message.');
            console.error(res);
        } else {
            return res.json();
        }
    }).then((data) => {
        const recipientId = data['recipient_id'];
        const messageId = data['message_id'];
        console.log(`Successfully sent text message with id ${messageId} to recipient ${recipientId}`);
    });
};

module.exports = sendTextMessage;
