'use strict';

const fs = require('fs');

class Responder {

    constructor(config) {
        this._workinghours = config.workinghours;
        this._nonworkinghours = config.nonworkinghours;
    }

    hello(id, userdata) {
        return this._processHello(userdata);
    }

    say(id, message) {
    }

    bye(id) {
    }

    _processHello(userdata) {
        const filename = this._workingHours() ? this._workinghours : this._nonworkinghours;
        const content = fs.readFileSync(filename).toString();
        return this._processTemplate(userdata, content);
    }

    _processTemplate(userdata, content) {
        let result = content.replace(/\$username/g, userdata.name);
        if(userdata.email) {
            result = result.replace(/\$useremail/g, userdata.email);
        }
        return result;
    }

    _workingHours() {
        const now = new Date();
        const day = now.getDay();
        const hour = now.getHours();
        return (day < 6) && (hour > 8 && hour < 18);
    }

}

module.exports = Responder;
