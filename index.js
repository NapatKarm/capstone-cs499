// require('dotenv').config();
const express = require('express');

const app = express();

// Connect to FireBase
var admin = require("firebase-admin");

var serviceAccount = require("./service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://c-vivid-default-rtdb.firebaseio.com"
});


app.listen(5000, () => console.log('App is listening on Port 5000'));
app.get('/', function (req, res) {
  res.send('hello world')
})