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
    if (!persistentData.processName || !persistentData.processId)
        return done(null, {});

    var docRef = this.firestore
        .collection("processes").doc(persistentData.processName)
        .collection("instances").doc(persistentData.processId);
    docRef.set({
        stateJson: JSON.stringify(persistentData)
    }).then((result) => {
        done(null, persistentData);
    });//.catch(error => done(error));
};

/**
 * @param {String} processId
 * @param {String} processName
 * @param done
 */
Persistency.prototype.load = function (processId, processName, done) {

    if (!processId || !processName)
        return done(null, {});

    var docRef = this.firestore
        .collection("processes").doc(processName)
        .collection("instances").doc(processId);

    docRef.get().then((snapshot) => {
        if (snapshot.exists)
            done(null, JSON.parse(snapshot.data().stateJson));
        else
            done(null, {});
    });//.catch(error => { done(error); });
};

/**
 * @param {String} processName
 * @param done
 */
Persistency.prototype.loadAll = function (processName, done) {
    if (!processName)
        return done(null, []);

    var colRef = this.firestore
        .collection("processes").doc(processName)
        .collection("instances");
    colRef.get().then(snapshots => {
        var entries = [];
        if (!snapshots.empty) {
            for (var snapshot of snapshots.docs)
                entries.push(JSON.parse(snapshot.data().stateJson));
        }
        done(null, entries);
    });//.catch(error => { console.log(error); done(error); });
};

/**
 * @param done
 */
Persistency.prototype.close = function (done) { done(); };