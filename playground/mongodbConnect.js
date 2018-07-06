const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/VoteMe', (err, client) => {

    if (err) {

        return console.log('Unable to connect to MongoDB server');

    }

    console.log('Connected to MongoDB server');
    const db = client.db('VoteMe');

    client.close();

});