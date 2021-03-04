// require('dotenv').config();
const express = require('express');

const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to FireBase
var admin = require("firebase-admin");
var serviceAccount = require("./service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://c-vivid-default-rtdb.firebaseio.com"
});

const db = admin.firestore();
const usersdb = db.collection('users'); 
const busdb = db.collection('business');
// Default testing endpoint
app.get('/', function (req, res) {
  res.send('hello world')
});

//Declare Test/Temp Map
let authMap = new Map();
let businessMap = new Map();
let businessId = 0;

// Sign-up end point
app.post('/signup', async (req, res) => {         //Expected request: {firstname, lastname, email, password}
  const existing_user = usersdb.where('email', '==', req.body.email).get();
  if(!existing_user.empty) {                //Email is taken
    res.status(422).send("Username already in use");
  }
  else{
    const userInfo = {                                  //User Info Structure
      'firstname': req.body.firstname,
      'lastname': req.body.lastname,
      'email': req.body.email,
      'password': req.body.password,
      'businesses': []
    };
    try {
      await usersdb.add(userInfo);
      res.status(200).send("Successfully registered");
    } catch(error){
      console.log(error);
    }
  }
});

// Sign-in Endpoint
app.post('/signin', async (req, res) => {         //Expected request: {email, password}
  const existing_user = usersdb.where('username', '==', req.body.email).get();
  // For security reasons, you do not disclose whether email or password is invalid
  try {
    if(!existing_user.empty || existing_user.get('email') != req.body.email || existing_user.get('password') !=  req.body.password) {  // Compares username and passwords to queried document
      res.status(422).send("Invalid email or password");
    }
    else {
      // res.status(200).send()
    }
    // if(authMap.has(req.body.email)){                //If existing email
    //   if(authMap.get(req.body.email).password == req.body.password){          //If correct password
    //     resInfo = Object.assign({}, authMap.get(req.body.email));             //delete password from data
    //     delete resInfo.password;
    //     res.status(200).json(resInfo);              //Response: {firstname, lastname, email, businesses[{business_id, businessname, businessaddr, businesspass, members[{firstname, lastname, email, role}]}]}
    //   }
    // }
  } catch(error) {
    console.log(error);
  }
});

app.post('/businessRegister', async (req, res) => {     //Expected request: { businessname, businessaddr, owner, businesspass} (owner: email?)
  const existing_business = usersdb.where('businessaddr', '==', req.body.businessaddr).get();
  if(!existing_business){   //Business already registered, cannot have 2 businesses on same address
    res.status(400).send("Business Already Registered")
  }
  else{
    const businessInfo = {                                    //Business Info Structure
      "businessname": req.body.businessname,
      "businessaddr": req.body.businessaddr,
      "businesspass": req.body.businesspass,
      "members": [{                                     //Member Info Structure
        "firstname": authMap.get(req.body.owner).firstname,
        "lastname": authMap.get(req.body.owner).lastname,
        "email": req.body.owner,
        "role": "admin"
      }]
    };
    try {
    await busdb.add(businessInfo);        //Add business data to business 'database'
    } catch(error) {
      console.log(error);
    }
  }
});

app.post('/businessJoin', async (req, res) => {                     //Expected request: {email, businesspass, businessaddr, role}
  const existing_business = usersdb.where('businessaddr', '==', req.body.businessaddr).get();
  if(!existing_business){   // Non-existing Business
    res.status(400).send("Business Already Registered")
  }
  
  else if(req.body.passcode != businessMap.get(req.body.businessaddr).businesspass){        //If incorrect passcode
    res.status(400).send("Incorrect Passcode");
  }
  else{                                                             //If existing business and correct passcode
    businessInfo = businessMap.get(req.body.businessaddr);          //Get data from business 'database'
    userInfo = authMap.get(req.body.email);                         //Get data from user 'database'

    alreadyInBusiness = false;
    for(i = 0; i < businessInfo.members.length; i++){               //Check if user is already registered under the business
      if(userInfo.email == businessInfo.members[i].email){
        alreadyInBusiness = true;
        break;
      }
    }

    if(alreadyInBusiness == true){                                  //If user has already been registered
      res.status(400).send("You have already been registered")
    }
    else{                                                           //If user has not been registered
      businessInfo.members.push({                                   //Add user as member under the business
        "firstname": userInfo.firstname,
        "lastname": userInfo.lastname,
        "email": req.body.email,
        "role": req.body.role
      });
      userInfo.businesses.push(businessInfo);                       //Add business data to user 'database' under businesses

      res.status(200).send("Successfully Joined");
    }
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App is listening on Port ${port}`));
