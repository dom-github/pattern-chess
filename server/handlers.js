require("dotenv").config({ path: ".env" });
const { MONGO_URI } = process.env;
const MongoClient = require("mongodb/lib/mongo_client");
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// client connect
const activateConn = async (client, dbName, colName) => {
  await client.connect();
  console.log("connected");
  const db = client.db(dbName);
  const col = await db.collection(colName);
  return col;
};

// client disconnect
const deactivateConn = async (client) => {
  await client.close();
  console.log("disconnected");
};

// response format
const response = (res, code, msg, result) => {
  return res.status(code).json({ status: code, data: result, message: msg });
};


    //Return all player games from DB 
    const getPlayers = async (req, res) => {
        const client = new MongoClient(MONGO_URI, options);

        try {
            const conn = await activateConn(client, "ChessDB", "Players");
            
            await conn.find().toArray((err, result) => {
            if (err) {
                response(res, 404, "Data Not Found");
            } else {
                response(res, 200, "Successfully retrieved players", result);
            }
            deactivateConn(client);
            });
        } catch (error) {
            response(res, 500, "Server Error");
        }
    };

    
    //Add one user to the database with POST
    const addUser = async (req, res) => {
        const client = new MongoClient(MONGO_URI, options);

        try {
            const conn = await activateConn(client, "ChessDB", "Users");
            
            await conn.insertOne({
                user: req.body.user,
                chessHandle: req.body.chessHandle,
                board: req.body.board,
                history: req.body.history
                })
                
            res.status(201).json({ status: 201, data: req.body, message: "User added!" });

            deactivateConn(client);

        } catch (error) {
            response(res, 500, "Server Error");
        }
    };

    
    //get user info for login
    const getUser = async (req, res) => {
        const client = new MongoClient(MONGO_URI, options);
        const user = req.params.user;

        try {
            const conn = await activateConn(client, "ChessDB", "Users");
            
            await conn.findOne( { user } , (err, result) => {
                if (err) {
                    response(res, 404, "User Not Found");
                } else {
                    response(res, 200, "Successfully found user", result);
                }
                deactivateConn(client);
                });


        } catch (error) {
            response(res, 500, "Server Error");
        }
    };

    
    //Update the current board, history, profile for current user with PUT
    const updateUser = async (req, res) => {
        const client = new MongoClient(MONGO_URI, options);

        const user = req.params.user;

        try {
            const conn = await activateConn(client, "ChessDB", "Players");
            const values = { $set: { 
                "board": req.body.board, 
                "history": req.body.history, 
                "chessHandle": req.body.chessHandle, 
            }}
            await conn.updateOne({ user }, values)

            res.status(200).json({ status: 200, data: req.body, message: "User Information Updated" })
          
            deactivateConn(client);
        } catch (error) {
            response(res, 500, "Server Error");
        }
    };

    

    module.exports = {
        getPlayers,
        addUser,
        updateUser,
        getUser
    }