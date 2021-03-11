const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to FireBase
var admin = require('firebase-admin');
var serviceAccount = require('./service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://c-vivid-default-rtdb.firebaseio.com'
});

const db = admin.firestore();
// db.settings({ ignoreUndefinedProperties: true })
const usersdb = db.collection('users'); 
const busdb = db.collection('business');
// Default testing endpoint
app.get('/', function (req, res) {
  console.log(req.body);
  res.send('hello world');
});


// Sign-up end point
app.post('/signup', async (req, res) => {  //Expected request: {firstname, lastname, email, password}
  var existing_user = await usersdb.where('email', '==', req.body.email).get();
  if(!existing_user.empty) {               //Email is taken
    res.status(422).send('Email already in use');
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

//QuerySnapshot
// .empty = bool
// array[QueryDocumentSnapShots]

// Sign-in Endpoint
app.post('/signin', async (req, res) => {         //Expected request: {email, password}
  const existing_user = await usersdb.where('email', '==', req.body.email).get(); // QuerySnapshot
  //For security reasons, you do not disclose whether email or password is invalid
  try {
    if(existing_user.empty) { 
      res.status(422).send('Empty');
    }
    else if (!existing_user.empty && (existing_user.docs[0].get('email') != req.body.email) || (existing_user.docs[0].get('password') !=  req.body.password)) {
      res.status(422).send('Invalid email or password');
    }
    else {
      console.log('Successful Log In')
      res.status(200).send(existing_user.docs[0].data());
    }
  } catch(error) {
    console.log(error);
  }
});

// Business Register Endpoint
app.post('/businessRegister', async (req, res) => {     //Expected request: { businessname, businessaddr, owner_email, businesspass, first name, last name} (owner: email?)
  const existing_business = await busdb.where('businessaddr', '==', req.body.businessaddr).get();  //
  const owner = await usersdb.where('email','==', req.body.email).get();                           // Owner's Information
  if (!existing_business.empty) {   //Business already registered, cannot have 2 businesses on same address
    res.status(400).send('Business Already Registered');
  }
  else {
    try {
      const incrementing_id = await busdb.where('counter', '>=', 0).get();
      console.log("creating buss info");
      const businessInfo = {                       //Business Info Structure
        'businessname': req.body.businessname,
        'businessaddr': req.body.businessaddr,
        'businessid' : incrementing_id.docs[0].get('counter'),
        'businesspass': req.body.businesspass,
        'isopened' : false,
        'members': [{                              //Member Info Structure
          'firstname': owner.docs[0].get('firstname'),
          'lastname': owner.docs[0].get('lastname'),
          'email': req.body.email,
          'role': 'Owner'
        }]
      }
      await busdb.add(businessInfo); 
      let counter_ref = busdb.doc("INCREMENTING_COUNTER");
      counter_ref.update({ counter: admin.firestore.FieldValue.increment(1) });
      res.status(200).send(businessInfo);
    } catch(error) {
      console.log(error);
    }
  }
});

app.post('/businessJoin', async (req, res) => {                    //Expected request: {email, businesspass, businessid}
  const existing_business = usersdb.where('businesspass', '==', req.body.businesspass).where('businessid', '==', req.body.businessid).get();
  if (existing_business.empty) {                                       // Non-existing Business, false = empty document
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
    'role': 'Employee'
  });
  try {
    // 
    res.status(200).send('Successfully Joined'); 
  } catch (error) {
    console.log(error);
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App is listening on Port ${port}`));
