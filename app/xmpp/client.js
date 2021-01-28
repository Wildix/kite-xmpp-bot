'use strict';

const EventEmitter = require('eventemitter3');
const { client, xml} = require("@xmpp/client");

const route = require('./utils/route');

require('./utils/ExtendElement')();

const Ping = require('./modules/ping');

class XMPPClient extends EventEmitter {

    constructor(domain, config, timeout, logger) {
        super();
        this.logger = logger;
        this._domain = domain;
        this._config = config;
        this._timeout = timeout;
        this._getConnection().on('error', this._onError.bind(this));
        this._getConnection().on('offline', this._onOffline.bind(this));
        this._getConnection().on('stanza', this._onInputStanza.bind(this));
        this._getConnection().on('online', this._onOnline.bind(this));
        this._getConnection().on('status', this._onStatus.bind(this));

        this._getConnection().middleware.use(route('message', '*', '*', 'chat', this._receivedMessage.bind(this)));
    }

    _receivedMessage(ctx, _next){
        this._broadcastMessageEvent(ctx.stanza);
    }

    _broadcastMessageEvent(stanza) {
        this.emit('message', {
            from: stanza.getFromJid(),
            to: stanza.getToJid(),
            id: stanza.getId(),
            message: stanza
        });
    }

    _onError(err){
        this.logger.error({error: err.toString()}, 'Received an error by XMPP');
    }

    _onOffline(stanza){
        this.logger.info({stanza: stanza}, '_onOffline');
    }

    _onInputStanza(stanza){
        // catch all stanzas
        this.logger.debug({stanza: stanza}, 'Received stanza');
    }

    _onOnline(address){
        this.logger.info({address: address.toString()}, 'Online as');
        this._getConnection().send(xml("presence"));
    }

    _onStatus(status){
        this.logger.debug({status: status, message: 'Status'});
    }

    _getConnection(){
        if(!this._connection){
            this._connection = client({
                service: this._config.service,
                domain: this._domain,
                username: this._config.username,
                password: this._config.password,
            });

            Object.assign(this._connection, {
                logger: this.logger,
            });

            Object.assign(this._connection, {
                ping: new Ping(this._connection, {domain: this._domain, timeout: this._timeout}),
            });

        }
        return this._connection;
    }

    connection() {
        return this._connection;
    }

    sendMessage(from, to, message) {
        this.logger.info({msg: {
            from: from.toString(),
            to: to.toString()
        }}, 'Send message');

        const xmlMsg = xml(
                'message',
                {type: 'chat', from: from, to: to},
                xml('body', {}, message)
        );

        return this._getConnection().send(xmlMsg)
    }

    sendDisplayed(from, to, id) {
        const NS_MARKERS = 'urn:xmpp:chat-markers:0';
        const NS_HINT = 'urn:xmpp:hints';

        this.logger.info({msg: {
                from: from.toString(),
                to: to.toString(),
                id
            }}, 'Send displayed');

        const xmlMsg = xml(
            'message',
            {type: 'chat', from: from, to: to, id: id + '_displayed'},
            xml('displayed', {'xmlns': NS_MARKERS, 'id': id}),
            xml('store', {'xmlns': NS_HINT})
        );

        return this._getConnection().send(xmlMsg)
    }

    connect() {
        return this._getConnection().start()
        .catch(err => {
            this.logger.error(err.toString());
        });
    }

    stop() {
        this.logger.debug('Start disconnection');
        return this._getConnection().stop();
    }

}

module.exports = XMPPClient;
