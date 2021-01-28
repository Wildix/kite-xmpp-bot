------------------------
Wildix Kite XMPP bot SDK
------------------------

Requirements:
-------------
Last stable version of Node.js. Tested with version 14.15.4.

Quick start of example code:
----------------------------
1) Install required libraries with commands:
    cd wbot
    npm install
2) Edit config parameters in the file wbot/app/config.js:
   - change "domain" parameter to the PBX domain
   - edit "xmppService" "service" parameter with PBX host
   - change "username" and "password" parameter to the bot credentials
     (currently the bot has fixed username "777999")
3) Run the bot with commands:
    cd app
    node indes.js

Config file parameters:
-----------------------
    domain: PBX domain name
    responder: path to the responder module
    responderConfig: responder config parameters
    timeout: XMPP requests timeout in ms
    xmppService: XMPP service and credentials parameters

Responder public methods:
-------------------------
hello(id, userdata)
    id - string representation of Kite user jid, like 'web60003a63d4a2a@kite.wildix.com'
    userdata - object, represents a new connections from Kite user. Has two fields - name (user name) and email (user email)

    If this method returns a string, it used as bot welcome message for user.

say(id, message)
    id - same as in hello()
    message - user input as string

    If this method returns a string it used as bot answer.

Please see included "staticfiles" responder example for details.
