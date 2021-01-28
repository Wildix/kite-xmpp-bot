const {Element} = require('@xmpp/xml');
const JID = require('@xmpp/jid');

module.exports = function (){

    Element.prototype.getNick = function(){
        return this.getChildText('nick', 'http://jabber.org/protocol/nick');
    }

    Element.prototype.getStatus = function(){
        return this.getChildText('status');
    }

    Element.prototype.getType = function() {
        return this.getAttr('type') || 'normal';
    }

    Element.prototype.getFromJid = function() {
        return JID(this.getAttr('from'));
    }

    Element.prototype.getToJid = function() {
        return JID(this.getAttr('to'));
    }

    Element.prototype.getBody = function() {
        let body = this.getChild('body');
        if (body) {
            return body.getText();
        }
        return null;
    }

    Element.prototype.getId = function() {
        return this.attrs.id;
    }
}
