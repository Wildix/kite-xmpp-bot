cmake_minimum_required(VERSION 3.13)
project(kite_xmpp_bot)

set(CMAKE_CXX_STANDARD 14)

add_executable(kite_xmpp_bot
        app/responders/staticfiles/nonworkinghours.txt
        app/responders/staticfiles/responder.js
        app/responders/staticfiles/workinghours.txt
        app/utils/logger.js
        app/xmpp/modules/ping.js
        app/xmpp/utils/ExtendElement.js
        app/xmpp/utils/route.js
        app/xmpp/client.js
        app/xmpp/kite.js
        app/config.js
        app/index.js
        package.json
        README)
