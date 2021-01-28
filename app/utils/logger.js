'use strict';

const callsites = require('callsites');
const pino = require('pino');
const path = require('path');

let baseDir = path.resolve(__dirname, '..', '..', '..') + path.sep;

const logger = pino({
    prettyPrint: process.env.NODE_ENV == 'development',
    base: null,
    messageKey: 'message',
    level: process.env.LOG_LEVEL || 'debug',
    mixin() {
        let trace = callsites();
        return {
            file: trace[3].toString().replace(baseDir, ''),
        }
    },
    formatters: {
        log(object) {
            if(object.stanza){
                object.stanza = object.stanza.toString();
            }
            return object
        }
    }
});

module.exports = logger;
