'use strict';

var utils = require('./utils/utils');
var UsersController = require('./controllers/api/users-controller');
var ApplicationsController = require('./controllers/api/applications-controller');

var pathPrefix = '/api/v1';

module.exports = [{
    method: 'GET',
    path: pathPrefix + '/users/{id}/favorites',
    config: {
        handler: UsersController.getFavoriteAppsByUserId,
        auth: {
            mode: 'try',
            strategy: 'session'
        }
    }
}, {
    method: 'GET',
    path: pathPrefix + '/users/{id}',
    config: {
        handler: UsersController.getUserById,
        auth: {
            mode: 'try',
            strategy: 'session'
        }
    }
}, {
    method: 'GET',
    path: pathPrefix + '/users/{id}/applications',
    config: {
        handler: ApplicationsController.getAppsByUserId,
        auth: {
            mode: 'try',
            strategy: 'session'
        }
    }
}, {
    method: 'GET',
    path: pathPrefix + '/applications',
    config: {
        handler: ApplicationsController.getApplications
    }
},

/**
 *
 * SWAGGER DOCUMENTATION
 *
 */
{
    method: 'GET',
    path: pathPrefix + '/doc',
    handler: function (request, reply) {
        reply.redirect(utils.getURL() + pathPrefix + '/swagger/index.htm');
    }
}, {
    method: 'GET',
    path: pathPrefix + '/docs',
    handler: function (request, reply) {
        reply.redirect(utils.getURL() + pathPrefix + '/swagger/index.htm');
    }
}, {
    method: 'GET',
    path: pathPrefix + '/swagger/index.htm',
    handler: function (request, reply) {
        var url = utils.getURL() + '/schemas/v1/swagger.json';
        var json = {
            swagger_url: url
        };
        reply.view('swagger_index.ejs', json);
    }
}, {
    method: 'GET',
    path: '/schemas/v1/swagger.json',
    handler: function (request, reply) {
        var json = {
            base_url: utils.getURL_NoProtocol()
        };

        reply.view('schemas/v1/swagger.ejs', json);
    }
}, {
    method: 'GET',
    path: '/schemas/{param*}',
    handler: {
        directory: {
            path: 'views/schemas',
            listing: true
        }
    }
}, {
    method: 'GET',
    path: pathPrefix + '/swagger/{param*}',
    handler: {
        directory: {
            path: 'swagger-ui',
            listing: false
        }
    }
}];