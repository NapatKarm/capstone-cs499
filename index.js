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

app.get('/', function (req, res) {
  res.send('hello world')
});

//Declare Test/Temp Map
let authMap = new Map();

let businessMap = new Map();
let businessId = 0;

app.post('/signup', async (req, res) => {         //Expected request: {firstname, lastname, email, password}
  if(authMap.has(req.body.email)){                //Email is taken
    res.status(422).send("Username already in use");
  }
  else{
    userInfo = {                                  //User Info Structure
      "firstname": req.body.firstname,
      "lastname": req.body.lastname,
      "email": req.body.email,
      "password": req.body.password,
      "businesses": []
    }
    authMap.set(req.body.email, userInfo);        //Add user info to 'database'
    res.status(200).send("Successfully registered");
  }
});

app.post('/signin', async (req, res) => {         //Expected request: {email, password}
  if(authMap.has(req.body.email)){                //If existing email
    if(authMap.get(req.body.email).password == req.body.password){          //If correct password
      authMap.get(req.body.email).token = uuidv4();
      resInfo = Object.assign({}, authMap.get(req.body.email));             //delete password from data
      delete resInfo.password;
      delete resInfo.businesses;

      res.status(200).json(resInfo);              //Response: {firstname, lastname, email, businesses[{business_id, businessname, businessaddr, businesspass, members[{firstname, lastname, email, role}]}]}
    }
    else{                                         //If Incorrect Password
      res.status(401).send("Incorrect Password");           
    }
  }
  else{                                           //If non-existing email
    res.status(404).send("Email Not Found");
  }
});

app.post('/businessRegister', async (req, res) => {     //Expected request: { businessname, businessaddr, owner, businesspass} (owner: email?)
  if(businessMap.has(req.body.businessaddr)){           //Business already registered
    res.status(400).send("Business Already Registered")
  }
  else{
    businessId++;
    businessInfo = {                                    //Business Info Structure
      "business_id": businessId,
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
    businessMap.set(req.body.businessaddr, businessInfo);           //Add business data to business 'database'
    authMap.get(req.body.owner).businesses.push(businessInfo);      //Add business data to user 'database' under businesses
    res.status(200).json(businessInfo);
  }
});

app.post('/businessJoin', async (req, res) => {                     //Expected request: {email, businesspass, business_id, role}
  if(!businessMap.has(req.body.business_id)){                      //If non-existing business
    res.status(400).send("Business group does not exist");
  }
  else if(req.body.passcode != businessMap.get(req.body.business_id).businesspass){        //If incorrect passcode
    res.status(400).send("Incorrect Passcode");
  }
  else{                                                             //If existing business and correct passcode
    businessInfo = businessMap.get(req.body.business_id);          //Get data from business 'database'
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

//Refresh
app.get('/getBusinessData', function (req, res) {                   //Expected Request {email, token}
  if(authMap.get(req.body.email).token != req.body.token){
    res.status(400).send("Incorrect Token");
  }
  else{
    resInfo = Object.assign({}, authMap.get(req.body.email));
    delete resInfo.firstname;
    delete resInfo.lastname;
    delete resInfo.email;
    delete resInfo.password;
    delete resInfo.token;

    res.status(200).json(resInfo);                                  //Response: {businesses[{business_id, businessname, businessaddr, businesspass, members[{firstname, lastname, email, role}]}]}
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App is listening on Port ${port}`));
