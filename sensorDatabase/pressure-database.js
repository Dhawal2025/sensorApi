const assert = require('assert');

var storePressure = async function(db, updateMessage) {
    const pressureCollection = db.collection('pressure');
    // Insert some documents
    var today = new Date();
    pressureCollection.insertOne({
            date: today,
            pressure : updateMessage.data.currentPressure
        }, function(err, result) {
        assert.equal(err, null);
        console.log("Inserted document into the collection");
        console.log("Pressure stored")
    });
    return true;
};

var findPressure = (db) => {
    return new Promise((resolve, reject) => { 
        const pressureCollection = db.collection('pressure');    
        pressureCollection.find({}).toArray(function(err, docs) {
            assert.equal(err, null);
            resolve(docs)
        });
    });
};

exports.storePressure = storePressure;
exports.findPressure = findPressure;
