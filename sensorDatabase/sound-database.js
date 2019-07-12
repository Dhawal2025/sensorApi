const assert = require('assert');

var storeSound = async function(db, decibals) {
    const soundCollection = db.collection('sound');
    // Insert some documents
    soundCollection.insertOne({
            decibals : decibals
        }, function(err, result) {
        assert.equal(err, null);
        console.log("Inserted document into the collection");
        console.log("Sound stored")
    });
    return true;
};

var findSound = (db) => {
    return new Promise((resolve, reject) => { 
        const soundCollection = db.collection('sound');    
        soundCollection.find({}).toArray(function(err, docs) {
            assert.equal(err, null);
            resolve(docs)
        });
    });
};

exports.storeSound = storeSound;
exports.findSound = findSound;
