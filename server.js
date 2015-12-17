/*eslint operator-linebreak: 0*/

'use strict';

require('process').on('uncaughtException', function (err) {
    console.log(err.stack);
});

var Hapi = require('hapi');
var config = require('./config.js');
var routes_front = require('./app/routes');
var routes_api_v1 = require('./app/routes_api_v1');
var utils = require('./app/utils/utils');
var fs = require('fs');
var ssl_root_cas = require('ssl-root-cas');

var logger = require('./app/utils/logger');
var namespace = require('continuation-local-storage');


// ADDING additionnal CAs
var truststore = config.get('https.truststore');
for (var index in truststore) {
    ssl_root_cas.addFile(truststore[index]);
}

var server = new Hapi.Server();

// Ecoute principale : ip_vp:port_ecoute
var options = {
    port: config.get('port_ecoute'),
    host: config.get('ip_vip'),
    routes: { cors: true },
    router: { stripTrailingSlash: false }
};


if (config.get('desactiver_https') === false) {
    options.tls = {
        key: fs.readFileSync(config.get('https.cle_privee')),
        cert: fs.readFileSync(config.get('https.certificat'))
    };
}

server.connection(options);

// Configuration de l'ip secondaire d'écoute : ip_exp:port_ecoute
if (config.get('ip_exp') !== 'none') {
    var options2 = {
        port: config.get('port_ecoute'),
        host: config.get('ip_exp'),
        routes: { cors: true },
        router: { stripTrailingSlash: false }
    };
    if (config.get('desactiver_https') === false) {
        options2.tls = {
            key: fs.readFileSync(config.get('https.cle_privee')),
            cert: fs.readFileSync(config.get('https.certificat'))
        };
    }
    server.connection(options2);
}

// Configuration du port de test secondaire (pour les tests casperjs) : ip_vip:port_ecoute_bis
if (config.get('port_ecoute_bis') !== 0) {
    var options3 = {
        port: config.get('port_ecoute_bis'),
        host: config.get('ip_vip'),
        routes: { cors: true },
        router: { stripTrailingSlash: false }
    };
    if (config.get('desactiver_https') === false) {
        options3.tls = {
            key: fs.readFileSync(config.get('https.cle_privee')),
            cert: fs.readFileSync(config.get('https.certificat'))
        };
    }
    server.connection(options3);
}

server.ext('onRequest', function (request, reply) {
    // Tout ce qui se passe dans le contexte de la fonction run
    // est associé au contexte propre de la requête
    // (principe similaire à une variable ThreadLocal en java)
    namespace.getNamespace('b7_-u1').run(function () {
        logger.setNewRequestId();
        logger.accesslog('debug', {
            method: request.method,
            path: request.path,
            query: request.query,
            event: 'received'
        });
        return reply.continue();
    });
});

server.ext('onPreHandler', function (request, reply) {
    if (request.auth.isAuthenticated) {
        logger.setUserLogin(request.auth.credentials.uid);
    }
    return reply.continue();
});

server.ext('onPreResponse', function (request, reply) {
    if (typeof request.response.header === 'function') {
        request.response.header('Access-Control-Allow-Credentials', 'true');
        request.response.header('X-UA-Compatible', 'IE=Edge'); // disable compatibility mode in IE
        if (request.path.endsWith('js')
            || request.path.endsWith('png')
            || request.path.endsWith('css')
            || request.path.endsWith('gif')
            || request.path.endsWith('woff')
            || request.path.endsWith('jpg')
            || request.path.endsWith('ttf')
            || request.path.endsWith('ico')
            || request.path.endsWith('svg')) {
            var current_time = new Date();
            current_time.setMilliseconds(current_time.getMilliseconds() + config.get('static_cache_max_age'));
            request.response.header('Expires', current_time.toUTCString());
        }
    }
    logger.accesslog('info', {
        method: request.method,
        status: request.response.statusCode,
        path: request.path,
        query: request.query,
        time: (new Date().getTime() - request.info.received),
        event: 'responded'
    });
    return reply.continue();
});

server.register(require('hapi-auth-cookie'), function (err) {
    if (err) {
        logger.log('error', err);
        throw err;
    }

    // Set our strategy
    server.auth.strategy('session', 'cookie', {
        password: config.get('hapi_auth_cookie.password'),
        cookie: config.get('hapi_auth_cookie.name'),
        clearInvalid: config.get('hapi_auth_cookie.clearInvalid'),
        isSecure: config.get('hapi_auth_cookie.isSecure'),
        ttl: config.get('hapi_auth_cookie.ttl')
    });
});

server.register(require('hapi-boom-codes'), function (err) {
    if (err) {
        logger.log('error', err);
        throw err;
    }
});

server.register([require('vision'), require('inert')], function (err) {
    if (err) {
        logger.log('error', 'Failed to load a plugin:', { toto: 123 });
        throw err;
    }

    server.views({
        engines: {
            ejs: require('ejs')
        },
        relativeTo: __dirname,
        path: 'views'
    });
});

// ROUTES SETTING
server.route(routes_front.default);
server.route(routes_api_v1);

if (config.get('activer_feature_flipping')) {
    server.route(routes_front.features);
}

if (config.get('is_test_env')) {
    options = {
        opsInterval: 1000,
        reporters: [{
            reporter: require('good-console'),
            events: { log: '*', response: '*' }
        }]
    };

    server.register({
        register: require('good'),
        options: options
    }, function (err) {
        if (err) {
            logger.log('error', err);
            throw err;
        }
    });
}

server.register({
    register: require('./libs/hapi-passport-saml'),
    options: {
        callbackUrl: config.get('passport.callback_url'),
        entryPoint: config.get('passport.entryPoint'),
        decryptionPvk: fs.readFileSync(config.get('passport.sp.pkey')).toString(),
        cert: fs.readFileSync(config.get('passport.idp.cert')).toString(),
        issuer: config.get('passport.issuer'),
        privateCert: fs.readFileSync(config.get('passport.sp.pkey')).toString(),
        authnContext: 'urn:oasis:names:tc:SAML:2.0:ac:classes:Password'
    }
}, function (err) {
    if (err) {
        logger.log('error', err);
        throw err;
    }
});

server.state('auto_connect', {
    ttl: config.get('auto_connect_timeout'),
    isSecure: true,
    isHttpOnly: true,
    encoding: 'base64json',
    clearInvalid: true
});

server.start(function () {
    logger.log('info', 'Server info', server.info);
    logger.log('info', 'HTTP server is running on ' + utils.getURL());
});

module.exports = {
    config: config
};