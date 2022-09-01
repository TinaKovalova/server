const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const appPort = process.env.PORT || 4004;
const mongoUrl = process.env.MONGODB_URI;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}

const UserScheme =  new mongoose.Schema(
    {
        name: String,
        nickname: String,
        avatar:String
    }
)

mongoose.model("Users", UserScheme);
const Users =mongoose.model("Users");


const getAll = ( request , response) =>{
    Users.find()
        .exec()
        .then(users => response.json(users))
        .catch(error => response.status(500).json(error));
}

const create = ( request , response) =>{
    Users.create(request.body)
        .then(user => response.json(user))
        .catch(error => response.status(500).json(error));
}

const update = ( request , response) =>{
    Users.updateOne({ _id: request.params.id}, {$set: request.body})
        .exec()
        .then(user => response.json(user))
        .catch(error => response.status(500).json(error));
}

const remove = ( request , response) =>{
    Users.deleteOne({ _id: request.params.id})
        .exec()
        .then(()=> response.json({success: true}))
        .catch(error => response.status(500).json(error));
}

app.get('/users', cors(corsOptions), getAll);
app.post('/users', cors(corsOptions), create);
app.put('/users/:id', cors(corsOptions), update);
app.delete('/users/:id', cors(corsOptions), remove);

mongoose.connect(mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(
        appPort,
        () => console.log(`Listening on port ${appPort}...`)
    ))
    .catch((error) => console.error(`Error connecting to mongo: ${mongoUrl}`, error))
