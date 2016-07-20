'use strict';

require('es6-promise').polyfill();
require('isomorphic-fetch');
const express = require('express');
const bodyParser = require('body-parser');
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

app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});
