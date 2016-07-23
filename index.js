'use strict';

require('es6-promise').polyfill();
require('isomorphic-fetch');
const express = require('express');
const bodyParser = require('body-parser');
const receivedMessage = require('./functions/receivedMessage');
const receivedDeliveryConfirmation = require('./functions/receivedDeliveryConfirmation');
const app = express();
const VALIDATION_TOKEN = process.env.VALIDATION_TOKEN;

app.set('port', (process.env.PORT || 3000));

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello world, I am Mr. Robot, your best helper!');
});

app.get('/webhook', (req, res) => {
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === VALIDATION_TOKEN) {
        console.log('Validating webhook');
        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.error('Failed validation. Make sure the validation tokens match.');
        res.sendStatus(403);
    }
});

app.post('/webhook', (req, res) => {
    const data = req.body;
    if (data.object === 'page') {
        data.entry.forEach((pageEntry) => {
            pageEntry.messaging.forEach((messagingEvent) => {
                if (messagingEvent.message) {
                    receivedMessage(messagingEvent);
                } else if (messagingEvent.delivery) {
                    receivedDeliveryConfirmation(messagingEvent);
                } else {
                    console.log('Webhook received unknown messagingEvent:');
                    console.log(messagingEvent);
                }
            });
        });
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});
