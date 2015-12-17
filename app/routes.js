'use strict';

var config = require('./../config.js');
var SessionController = require('./controllers/session-controller');
var SAMLController = require('./controllers/saml-controller');
var MonitoringController = require('./controllers/monitoring-controller');
var DefaultController = require('./controllers/default-controller');
var ConfigurationController = require('./controllers/configuration-controller');

module.exports.default = [{
    method: 'GET',
    path: '/favicon.ico',
    handler: {
        file: 'dist/img/favicon.ico'
    },
    config: {
        cache: {
            expiresIn: config.get('static_cache_max_age'),
            privacy: 'private'
        }
    }
}, {
    method: 'GET',
    path: '/',
    config: {
        handler: DefaultController.getHomePage,
        auth: {
            mode: 'try',
            strategy: 'session'
        }
    }
}, {
    method: 'GET',
    path: '/test-evenement-connexion',
    config: {
        handler: DefaultController.getTestConnexionEvent,
        auth: {
            mode: 'try',
            strategy: 'session'
        }
    }
}, {
    method: 'GET',
    path: '/test-modules',
    config: {
        handler: DefaultController.getTestBrowserEncapsulation,
        auth: {
            mode: 'try',
            strategy: 'session'
        }
    }
}, {
    method: 'GET',
    path: '/test-reset-css',
    config: {
        handler: DefaultController.getTestResetCSS,
        auth: {
            mode: 'try',
            strategy: 'session'
        }
    }
}, {
    method: 'GET',
    path: '/template',
    config: {
        handler: DefaultController.getTemplate,
        auth: {
            mode: 'try',
            strategy: 'session'
        },
        state: {
            parse: true, // parse and store in request.state
            failAction: 'ignore' // may also be 'ignore' or 'log'
        }
    }
}, {
    method: 'POST',
    path: '/configs/reload',
    handler: ConfigurationController.reload
}, {
    method: 'POST',
    path: '/login',
    config: {
        handler: SessionController.login,
        auth: {
            mode: 'try',
            strategy: 'session'
        }
    }
}, {
    method: 'GET',
    path: '/devLoginSaml',
    config: {
        handler: SessionController.devLoginSaml
    }
}, {
    method: 'POST',
    path: '/logout',
    config: {
        handler: SessionController.logout,
        auth: {
            mode: 'try',
            strategy: 'session'
        }
    }
}, {
    method: 'GET',
    path: '/is_authenticated',
    config: {
        handler: SessionController.isAuthenticated,
        auth: {
            mode: 'try',
            strategy: 'session'
        }
    }
}, {
    method: 'GET',
    path: '/configs',
    config: {
        handler: ConfigurationController.show
    }
}, {
    method: 'GET',
    path: '/monitoring',
    config: {
        handler: MonitoringController.runAllSondes
    }
}, {
    method: 'GET',
    path: '/dist/{param*}',
    handler: {
        directory: {
            path: 'dist',
            listing: false
        }
    },
    config: {
        cache: {
            expiresIn: config.get('static_cache_max_age'),
            privacy: 'private'
        }
    }
}, {
    method: 'GET',
    path: '/sp/metadata.xml',
    handler: SAMLController.metadata,
    config: {
        description: 'metadata',
        notes: 'metadata',
        tags: ['api']
    }
}, {
    method: 'GET',
    path: '/sp/login',
    handler: SAMLController.login,
    config: {
        description: 'login',
        notes: 'login',
        tags: ['api'],
        auth: {
            mode: 'try',
            strategy: 'session'
        }
    }
}, {
    method: ['GET', 'POST'],
    path: '/sp/assert',
    handler: SAMLController.assert,
    config: {
        description: 'assert',
        notes: 'assert',
        tags: ['api'],
        auth: {
            mode: 'try',
            strategy: 'session'
        }
    }
}, {
    method: 'POST',
    path: '/idp/entry',
    handler: SAMLController.printRequest
}];

module.exports.features = [
    {
        // TODO object body, not url
        method: 'PUT',
        path: '/configs/{key}/{value}',
        handler: ConfigurationController.set
    }
];

module.exports.test = [{
    method: 'GET',
    path: '/test',
    handler: function (request, reply) {
        reply.file('test/front/index.html');
    }
}, {
    method: 'GET',
    path: '/test/bandeau.js',
    handler: function (request, reply) {
        reply.file('dist/js/bandeau.js');
    }
}, {
    method: 'GET',
    path: '/test/bandeau_test.js',
    handler: function (request, reply) {
        reply.file('test/front/bandeau_test.js');
    }
}, {
    method: 'GET',
    path: '/test/data',
    handler: function (request, reply) {
        reply({}).code(200);
    }
}, {
    method: 'POST',
    path: '/test/data',
    handler: function (request, reply) {
        reply(request.payload);
    }
}];