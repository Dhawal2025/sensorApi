const assert = require('assert');

var storeTemperature = async function(db, temperature) {
    const furnaceTemperatureCollection = db.collection('furnace-temperature');
    // Insert some documents
    furnaceTemperatureCollection.insertOne({
            temperature : temperature
        }, function(err, result) {
        assert.equal(err, null);
        console.log("Inserted document into the collection");
        console.log("Temperature stored")
    });
    return true;
};

var findTemperature = (db) => {
    return new Promise((resolve, reject) => { 
        const furnaceTemperatureCollection = db.collection('temperature');    
        furnaceTemperatureCollection.find({}).toArray(function(err, docs) {
            assert.equal(err, null);
            resolve(docs)
        });
    });
};

exports.storeTemperature = storeTemperature;
exports.findTemperature = findTemperature;
