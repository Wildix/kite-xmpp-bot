'use strict';

const xml = require('@xmpp/xml');

const NS_PING = 'urn:xmpp:ping';

class Ping {

    constructor(xmpp, config){
        config = config || {};

        this._xmpp = xmpp;
        this._config = config;

        this._domain = this._config.domain || '';
        this._interval = this._config.interval || 6 * 1000;
        this._timeout = this._config.timeout || 5 * 1000;

        this._xmpp.on('online', this._enablePing.bind(this));
        this._xmpp.on('offline', this._disablePing.bind(this));
    }

    _enablePing() {
        this._disablePing();
        this._pingTimer = setTimeout(() => {
            this.ping();
            this._enablePing();
        }, this._interval);
    }

    _disablePing(){
        if(this._pingTimer){
            clearTimeout(this._pingTimer);
            this._pingTimer = null;
        }
    }

    ping() {
        this._xmpp.iqCaller.request(
                xml('iq',{
                        to: this._domain,
                        type: 'get'
                    },
                    xml('ping', {xmlns: NS_PING})
                ),
                this._timeout
          ).catch((error) => {
              this._xmpp.logger.error({error: error}, 'Ping');
          });
    }

}

module.exports = Ping;
