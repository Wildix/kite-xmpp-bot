'use strict';

let config = {
    domain: 'exampledomain.wildixin.com',
    timeout: 5 * 1000,

    responder: './responders/staticfiles/responder',
    responderConfig: {
        workinghours: './responders/staticfiles/workinghours.txt',
        nonworkinghours: './responders/staticfiles/nonworkinghours.txt'
    },

    xmppService: {
        service: 'xmpps://exampledomain.wildixin.com:443',
        username: '777999',
        password: 'pass'
    }
};

module.exports = config;
