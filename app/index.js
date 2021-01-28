'use strict';

// ignore ssl certificate
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

process.env.NODE_ENV = process.env.NODE_ENV || 'development'; // production or development
process.env.LOG_LEVEL = (process.env.NODE_ENV === 'development') ? 'debug' : 'info'; // One of 'fatal', 'error', 'warn', 'info', 'debug', 'trace' or 'silent'

const logger = require('./utils/logger.js');

const config = require('./config');

logger.debug({config: config});

const XmppClient = require('./xmpp/client');
const KiteManager = require('./xmpp/kite');
const BotResponder = require(config.responder);

const timeout = config.timeout || 5 * 1000;
const xmpp = new XmppClient(config.domain, config.xmppService, timeout, logger);
const responder = new BotResponder(config.responderConfig);
const kite = new KiteManager(xmpp, config.domain, responder, timeout, logger);

xmpp.connect()
.then(()=>{
    logger.info('Connected');
})
.catch(err => {
    logger.error(err.toString());
});

xmpp.on('message', async ({from, to, id, message}) => {
    const loggerData = {
        msg: {
            from: from.toString(),
            to: to.toString(),
            messageId: id
        }
    };
    logger.info(loggerData, 'New message from Kite');

    kite.processMessage(from, to, id, message)
        .then(msgid => {
            logger.info({...loggerData, msgid}, 'Message processed');
            
        })
        .catch((error) => {
            logger.error({...loggerData, error: error.toString()}, 'Message process failed');
        });
});

function gracefulExit(signal) {
    logger.info('Received signal:', signal);

    return xmpp.stop()
        .then(function(){
            process.exit();
        }).catch(function(err){
            logger.error(err.toString());
            process.exit();
        });
}

process.on('SIGINT', gracefulExit);
process.on('SIGTERM', gracefulExit);
