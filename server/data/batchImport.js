const { MongoClient } = require("mongodb");

require("dotenv").config();

const { MONGO_URI } = process.env;

const { players } = require("./Players")


const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const batchImport = async () => {
    try {
        const client = new MongoClient(MONGO_URI, options);
    
        // connect to the client
        await client.connect();
    
        console.log(players)
        
        // connect to the database
        const db = client.db('ChessDB');
        console.log("connected!");
        
    // const playersdb = await db.collection("Players").insertMany(players);
    // console.log(playersdb);

    // close the connection to the database server
    client.close();
    console.log("disconnected!");


    } catch (err) {
        console.log(err.stack);
    };

}

batchImport();