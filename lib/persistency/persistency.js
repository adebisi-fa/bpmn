/**
 * Copyright: E2E Technologies Ltd
 */
"use strict";

var FilePersistency = require('./file.js').Persistency;
var MongoDBPersistency = require('./mongodb.js').Persistency;
var FirestorePersistence = require('./firestore').Persistency;

/**
 * @param {{ 
 *   url: String, 
 *   implementation: { persist(data: {processId, processName, ...}, done),
 *      load(processId, processName, done),
 *      loadAll(processName, done),
 *      close(done)
 *   }
 * }} options
 * 
 * @constructor
 */
var Persistency = exports.Persistency = function (options) {
    var isMongoDbUri;
    var implementation = options ? options.implementation : null;
    
    if (implementation) {
        this.implementation = implementation;
        return;
    }

    var url = option.url;
    if (url) {
        isMongoDbUri = url.indexOf('mongodb://') === 0;
        if (isMongoDbUri) {
            this.implementation = new MongoDBPersistency(url, options);
        } else {
            this.implementation = new FilePersistency(url);
        }
    } else {
        throw new Error("Persistency options must contain a url property.");
    }
};

/**
 * @param {{processInstanceId: String}} persistentData
 * @param {Function} done
 */
Persistency.prototype.persist = function (persistentData, done) {
    this.implementation.persist(persistentData, done);
};

/**
 * @param {String} processId
 * @param {String} processName
 * @param done
 */
Persistency.prototype.load = function (processId, processName, done) {
    this.implementation.load(processId, processName, done);
};

/**
 * @param {String} processName
 * @param done
 */
Persistency.prototype.loadAll = function (processName, done) {
    this.implementation.loadAll(processName, done);
};

/**
 * @param done
 */
Persistency.prototype.close = function (done) {
    this.implementation.close(done);
};