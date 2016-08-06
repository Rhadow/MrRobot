import { Wit, log } from 'node-wit';
import sendTextMessage from './sendTextMessage';
import { FB_GRAPH_API_URL } from '../constants/';

const sessions = {};

export function setSessionContext(sessionId, newContext) {
    sessions[sessionId].context = newContext;
}

export function getSessionContext(sessionId) {
    return sessions[sessionId].context;
}

export function findOrCreateSession(fbid) {
    let sessionId;

    Object.keys(sessions).forEach(key => {
        if (sessions[key].fbid === fbid) {
            sessionId = key;
        }
    });
    if (!sessionId) {
        sessionId = new Date().toISOString();
        sessions[sessionId] = {
            fbid,
            context: {}
        };
    }
    return sessionId;
}

const witActions = {
    send({ sessionId }, { text }) {
        const recipientId = sessions[sessionId].fbid;
        if (recipientId) {
            return sendTextMessage(recipientId, text)
            .then(() => null)
            .catch((err) => {
                console.error(
                    'Oops!, An error occured while forwarding the response to',
                    recipientId,
                    ':',
                    err.stack || err
                );
            });
        } else {
            console.error('Oops! Couldn\'t find user for session: ', sessionId);
            return Promise.resolve();
        }
    },
    getUserName({ sessionId, context, entities }) {
        const userFbId = sessions[sessionId].fbid;
        return new Promise((resolve, reject) => {
            fetch(`${FB_GRAPH_API_URL}${userFbId}?fields=first_name,last_name&access_token=${process.env.FB_PAGE_ACCESS_TOKEN}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.error && data.error.message) {
                    throw new Error(data.error.message);
                }
                context.userName = data['first_name'];
                return resolve(context);
            })
            .catch((err) => {
                console.error(`Fetch user id ${userFbId} failed!`, err.stack || err);
                return resolve(context);
            });
        });
    }
};

const wit = new Wit({
    accessToken: process.env.WIT_TOKEN,
    actions: witActions,
    logger: new log.Logger(log.INFO)
});

export default wit;
