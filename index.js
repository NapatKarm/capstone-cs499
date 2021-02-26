// require('dotenv').config();
const express = require('express');

const app = express();

// Connect to FireBase
var admin = require("firebase-admin");

var serviceAccount = require("serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://c-vivid-default-rtdb.firebaseio.com"
});


app.listen(5000, () => console.log('App is listening on Port 5000'));

// https://nodejs.dev/learn/an-introduction-to-the-npm-package-manager
// https://docs.npmjs.com/cli/v7/configuring-npm/package-json#dependencies
// https://github.com/TraceyKong/GetGud/commits/main?after=c4926006c50d575c3f20c87a370a4e52a14b6135+104&branch=main
// https://github.com/TraceyKong/GetGud/commit/8e1617fa149fdb6dabefec40ea83eaefd8dc3468
// https://github.com/TraceyKong/GetGud/blob/main/backend/index.js
// https://nodejs.dev/learn/how-to-use-or-execute-a-package-installed-using-npm
// https://www.npmjs.com/package/socket.io
// https://firebase.google.com/docs/cli?authuser=0#windows-npm
// https://web.postman.co/workspace/b0ac162f-9039-425c-840e-91ee11cc105d/request/10630915-dd334e07-ddd4-494a-894f-7dc5ba7e89b3