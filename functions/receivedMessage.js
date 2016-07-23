const sendTextMessage = require('./sendTextMessage');

const receivedMessage = (event) => {
    const senderId = event.sender.id;
    const recipientId = event.recipient.id;
    const timeOfMessage = event.timestamp;
    const message = event.message;
    const messageId = message.mid;
    const messageText = message.text;
    const messageAttachments = message.attachments;

    console.log(`Received message for user ${senderId} and page ${recipientId} at ${timeOfMessage} with message:`);
    console.log(JSON.stringify(message));

    if (messageText) {
        sendTextMessage(senderId, `Echo: ${messageText}`);
    } else if (messageAttachments) {
        sendTextMessage(senderId, 'Message with attachment received!');
    }
};

module.exports = receivedMessage;
