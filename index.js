// require('dotenv').config();
const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to FireBase
var admin = require("firebase-admin");

var serviceAccount = require("./service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://c-vivid-default-rtdb.firebaseio.com"
});

const port = process.env.PORT || 5000;


app.get('/', function (req, res) {
  res.send('hello world')
});

//Declare Test/Temp Map
let authMap = new Map();

app.post('/signup', async (req, res) => {
  if(authMap.has(req.body.email)){
    res.status(422).send("Username already in use");
  }
  else{
    authMap.set(req.body.email, req.body.password);
    res.sendStatus(200);
  }
});

app.post('/login', async (req, res) => {
  if(authMap.has(req.body.email)){
    if(authMap.get(req.body.email) == req.body.password){
      res.sendStatus(200).send("Login Success");
    }
    else{
      res.sendStatus(401).send("Incorrect Password");
    }
  }
  else{
    res.sendStatus(404).send("Username Not Found");
  }
});

app.listen(port, () => console.log(`App is listening on Port ${port}`));

