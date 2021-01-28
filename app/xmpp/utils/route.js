'use strict';

function route(name) {
    // elName, subName, subNs, elType, handler

    var eArg = {
            handler: arguments[arguments.length - 1],
            name: name,
            type: '*',
            childName: '*',
            childNS: '*',
    };

    if (arguments.length > 2){
        eArg.childName = arguments[1];
    }

    if (arguments.length > 3){
        eArg.childNS = arguments[2];
    }

    if (arguments.length > 4){
        eArg.type = arguments[3];
    }


    return function(ctx, next){
        if (ctx.stanza.is(eArg.name)){
            if(eArg.type == '*' || ctx.type == eArg.type){
                const element = ctx.stanza.getChildrenByFilter(function(child){
                    if(
                        (eArg.childName == '*' || child.name == eArg.childName) &&
                        (eArg.childNS   == '*' || child.attrs['xmlns'] == eArg.childNS)
                    ){
                        return child;
                    }
                    return false;
                }, true)[0];

                if(element){
                    return eArg.handler(ctx, next)
                }
            }
        }
        return next()
    }
}

module.exports = route;
