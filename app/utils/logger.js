'use strict';

var config = require('../../config.js');
var uuid = require('node-uuid');
var REQ_ID = 'reqid';
var LOGIN_KEY = 'login';
var APP_NAMESPACE = 'b7_-u1';

/*
 * Création du namespace de principal de l'application
 * see : https://www.npmjs.com/package/continuation-local-storage
 */

var namespace = require('continuation-local-storage');
namespace.createNamespace(APP_NAMESPACE);

var PEBSCCLogger = function () {
    var	winston	= require('winston');
  	var logger_main = new (winston.Logger)({
        transports: [
	    	new (winston.transports.File)({
	    	  filename: config.get('logs.main_path'),
	   	 	  level: config.get('logs.main_level'),
	   	 	  handleExceptions: true
	    })],
	    exitOnError: false
	});

  	var logger_access = new (winston.Logger)({
  		transports: [
	    	new (winston.transports.File)({
	    	  filename: config.get('logs.accesslog_path'),
	   	 	  level: config.get('logs.accesslog_level'),
	   	 	  handleExceptions: true,
    		  showLevel: false
	    })],
	    exitOnError: false
	});

	this.log = function(level, message, meta){
		logger_main.log(level, message, appendRequestMeta(meta));
		if(config.get('log_console')) {
			console.log(level, message, meta);
		}
    };
    
	this.accesslog = function(level, meta){
		logger_access.log(level, appendRequestMeta(meta));
    };
    
    this.setNewRequestId = function () {
		var session = namespace.getNamespace(APP_NAMESPACE);
		session.set(REQ_ID, uuid.v4());
	};
	
    this.setUserLogin = function (login) {
		var session = namespace.getNamespace(APP_NAMESPACE);
		session.set(LOGIN_KEY, login);
	};
	
	var appendRequestMeta = function(json) {
		//TODO test on var type
		var session = namespace.getNamespace(APP_NAMESPACE);
		if (json === undefined) {
			return {reqid : session.get(REQ_ID), login : session.get(LOGIN_KEY)};
		} else {
			json.reqid = session.get(REQ_ID);
			json.login = session.get(LOGIN_KEY);
			return json;
		}
	};
};

/*
 * Singleton
 */
PEBSCCLogger.instance = null;
PEBSCCLogger.getInstance = function() {
    if(this.instance === null){
        this.instance = new PEBSCCLogger();
    }
    return this.instance;
}

module.exports = PEBSCCLogger.getInstance();
