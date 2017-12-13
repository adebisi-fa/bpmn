/**
 * @param {*} firestore
 * @constructor
 */
var Persistency = exports.Persistency = function (firestore) {
    this.firestore = firestore;
};

/**
 * @param {{processId: String, processName: String}} persistentData
 * @param {Function} done
 */
Persistency.prototype.persist = function (persistentData, done) {
    var docRef = this.firestore
        .collection("processes").doc(persistentData.processName)
        .collection("instances").doc(persistentData.processId);
    docRef.set(persistentData).then((snapshot) => {
        done();
    });
};

/**
 * @param {String} processId
 * @param {String} processName
 * @param done
 */
Persistency.prototype.load = function (processId, processName, done) {
    var docRef = this.firestore
        .collection("processes").doc(processName)
        .collection("instances").doc(processId);
    docRef.get().then((snapshot) => {
        if (snapshot.exists)
            done(snapshot.data());
        else
            done({});
    }).catch((error) => {
        console.log(error);
        done({});
    });
};

/**
 * @param {String} processName
 * @param done
 */
Persistency.prototype.loadAll = function (processName, done) {
    var colRef = this.firestore
        .collection("processes").doc(processName)
        .collection("instances");
        
    colRef.get().then((snapshots) => {
        var entries = [];
        for (var snapshot of snapshots)
            entries.push(snapshot.data());
        done(entries);
    }).catch((error) => {
        console.log(error);
        done([]);
    });
};

/**
 * @param done
 */
Persistency.prototype.close = function (done) { done(); };