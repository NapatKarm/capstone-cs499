// require('dotenv').config();
const express = require('express');

const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to FireBase
var admin = require('firebase-admin');
var serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://c-vivid-default-rtdb.firebaseio.com'
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

// Sign-up end point
app.post('/signup', async (req, res) => {  //Expected request: {firstname, lastname, email, password}
  const existing_user = usersdb.where('email', '==', req.body.email).get();
  if(!existing_user.empty) {               //Email is taken
    res.status(422).send('Username already in use');
  }
  else{
    const userInfo = {                     //User Info Structure
      'firstname': req.body.firstname,
      'lastname': req.body.lastname,
      'email': req.body.email,
      'password': req.body.password,
      'businesses': []
    };
    try {
      await usersdb.add(userInfo);
      res.status(200).send('Successfully registered');
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
      res.status(422).send('Invalid email or password');
    }
    else {
      res.status(200).send(existing_user.data());
    }
  } catch(error) {
    console.log(error);
  }
});

// Needs work
app.put('/businessRegister', async (req, res) => {     //Expected request: { businessname, businessaddr, owner, businesspass, first name, last name} (owner: email?)
  const existing_business = usersdb.where('businessaddr', '==', req.body.businessaddr).get();
  if(!existing_business) {   //Business already registered, cannot have 2 businesses on same address
    res.status(400).send('Business Already Registered');
  }
  else {
    const businessInfo = {                       //Business Info Structure
      'businessname': req.body.businessname,
      'businessaddr': req.body.businessaddr,
      'businesspass': req.body.businesspass,
      'members': [{                              //Member Info Structure
        'firstname': req.body.firstname,
        'lastname': req.body.lastname,
        'email': req.body.owner,
        'role': 'admin'
      }]
    };
    try {
      await busdb.add(businessInfo);       
    } catch(error) {
      console.log(error);
    }
  }
});

app.post('/businessJoin', async (req, res) => {                     //Expected request: {email, businesspass, businessaddr}
  const existing_business = usersdb.where('businesspass', '==', req.body.businesspass).get();
  if (!existing_business) {                                       // Non-existing Business, false = empty document
    res.status(400).send('Business does not exist');
  }
  for (let i = 0; i < existing_business.members.length; i++) {  // Check if member already exists in a business
    if (existing_business.members[i].email == req.body.email) {
      res.status(422).send('User already is a member');
    }
  }                                                                                                                
  const new_member = ({                                   //Add user as member under the business
    'firstname': req.body.firstname,
    'lastname': req.body.lastname,
    'email': req.body.email,
    'role': 'employee'
  });
  try {
    res.status(200).send('Successfully Joined'); 
  } catch (error) {
    console.log(error);
  }
  
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App is listening on Port ${port}`));
