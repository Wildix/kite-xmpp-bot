'use strict';

const xml = require('@xmpp/xml');

const NS_KITE_MANAGER = 'urn:wildix:kite:manager';
const NS_KITE = 'urn:wildix:kite';

const USER_RE = /^(.+?) (?:\((\S+)\) )?(?:(?: is now available for chat)|(?: \u00e8 disponibile su chat)|(?: est disponible pour le chat)|(?:ist jetzt per Chat erreichbar)|(?:est\u00e1 disponible en el chat))\..+/;

class KiteManager {

    constructor(xmpp, domain, responder, timeout, logger) {
        this._xmpp = xmpp;
        this._domain = domain;
        this._responder = responder;
        this._timeout = timeout;
        this.logger = logger;
    }

    async processMessage(from, to, id, message) {
        const kitedata = message.getChild('kite', NS_KITE);
        if(kitedata) {
            const kitetype = kitedata.attrs.type;
            if(kitetype === 'pickup' || kitetype === 'lock') {
                this._sendDelivered(kitedata.attrs.jid, id);
                return id;
            }
        }

        this._xmpp.sendDisplayed(to, from, id);
        this._sendDelivered(from, id);

        const body = message.getBody();
        if(body) {
            const hello = body.match(USER_RE);
            if(hello) {
                const welcome = this._responder.hello(from.toString(), {name: hello[1], email: hello[2]});
                if(welcome) {
                    this._xmpp.sendMessage(to, from, welcome);
                }
                return id;
            }

            const response = this._responder.say(from.toString(), body);
            if(response) {
                this._xmpp.sendMessage(to, from, response);
            }
        }

        return id;
    }

    _sendDelivered(jid, id) {
        this._xmpp.connection().iqCaller.request(
                xml('iq', {to: this._domain, type: 'set'},
                    xml('query', {xmlns: NS_KITE_MANAGER},
                                  xml('delivered', {jid: jid, id: id}))
                ),
                this._timeout
          ).catch((error) => {
              this.logger.error({error: error}, 'Delivered request');
          });
    }
}

module.exports = KiteManager;
