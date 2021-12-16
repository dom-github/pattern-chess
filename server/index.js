const path = require('path');
const express = require('express');
const { getPlayers, getUser, addUser, updateUser } = require('./handlers');

const PORT = 8000;

express()

    .use(express.json())

    //endpoints

    .get("/api/db/players", getPlayers)

    .get("/api/db/users/:user", getUser)

    .post("/api/db/users", addUser)

    .put("/api/db/users/:user", updateUser)


    .listen(PORT, function() {
        console.info('🌍 Listening on port ' + PORT);
    });