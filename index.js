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
      counter_ref.update({ 
        counter: admin.firestore.FieldValue.increment(1)   // Really not intuitive because its different if using admin SDK 
      });
      res.status(200).send("Success");
    } catch(error) {
      console.log(error);
    }
  }
});

app.post('/businessJoin', async (req, res) => {                    //Expected request: {email, businesspass, businessid}
  const existing_business = await busdb.where('businesspass', '==', req.body.businesspass).where('businessid', '==', req.body.businessid).get();
  if (existing_business.empty) {                                       // Non-existing Business, false = empty document
    res.status(400).send('Business does not exist');
  }
  let member_list = existing_business.docs[0].get('members');
  for (let i = 0; i < member_list.length; i++) {       // Check if member already exists in a business
    if (member_list[i].email == req.body.email) {
      res.status(422).send('User already is a member');
    }
  }  
  
  const new_member_info = await usersdb.where('email', '==', req.body.email).get();       // Get the to-be-added employee's info from userdb and make an object                                                                                                     
  const new_member = ({                                   // Will be added to the business' member array
    'firstname': new_member_info.docs[0].get('firstname'),
    'lastname': new_member_info.docs[0].get('lastname'),
    'email': req.body.email,
    'role': 'Employee'
  });

  const bus_info = ({                                             // Business info to add to user's business array
    'businessaddr': existing_business.docs[0].get('businessaddr'),
    'businessname': existing_business.docs[0].get('businessname'),
    'businessid' : existing_business.docs[0].get('businessid')
  });

  let bus_ref = busdb.doc(existing_business.docs[0].id);   // References for pushing new data to arrays
  let user_ref = usersdb.doc(new_member_info.docs[0].id);
  try { 
    bus_ref.update({
      members: admin.firestore.FieldValue.arrayUnion(new_member)
    });
    user_ref.update({
      business: admin.firestore.FieldValue.arrayUnion(bus_info)
    })
    res.status(200).send('Successfully Joined'); 
  } catch (error) {
    console.log(error);
  }
});

//Refresh
app.post('/getBusinessData', async (req, res) => {                   //Expected Request {email, token}
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

app.post('/getSingleBusinessData', async (req, res) => {            //Expected: {business_id, email, token}
  if(authMap.get(req.body.email).token != req.body.token){
    res.status(400).send("Incorrect Token");
  }
  else{
    businessInfo = businessMap.get(req.body.business_id);          //Get data from business 'database'

    for(i = 0; i < businessInfo.members.length; i++){               //Check for owner or admin to change passcode
      if(businessInfo.members[i].email == req.body.email){
        res.status(200).send(businessMap.get(req.body.business_id));
      }
    }
    
    res.status(200).send(businessMap.get(req.body.business_id));
  }
});

app.put('/passcodeChange', async (req, res) => {                    //Expected: { business_id, email, token, businesspass}
  if(authMap.get(req.body.email).token != req.body.token){
    res.status(400).send("Incorrect Token");
  }
  else{
    businessInfo = businessMap.get(req.body.business_id);          //Get data from business 'database'

    for(i = 0; i < businessInfo.members.length; i++){               //Check for owner or admin to change passcode
      if(businessInfo.members[i].email == req.body.email){
        if(businessInfo.members[i].role == "Owner" || businessInfo.members[i].role == "Admin"){
          businessInfo.businesspass = req.body.businesspass;
          res.status(200).send("Change Success");
          break;
        }
        else{
          res.status(401).send("Not Enough Permissions");
        }
      }
    }
  }
});

app.put('/roleChange', async (req, res) => {                      //Expected: {business_id, changerEmail, changeeEmail, newRole, token}
if(authMap.get(req.body.changerEmail).token != req.body.token){
  res.status(400).send("Incorrect Token");
}
else{
  businessInfo = businessMap.get(req.body.business_id);          //Get data from business 'database'

  changerRole = ""            //Make sure changer is owner (only owner can change roles)
  changeePos = ""            //Record position of employee with role 'to be changed'

  for(i = 0; i < businessInfo.members.length; i++){               //Check for owner and position of changee
    if(businessInfo.members[i].email == req.body.changerEmail){
      changerRole = businessInfo.members[i].role;
    }
    else if(businessInfo.members[i].email == req.body.changeeEmail){
      changeePos = i;
    }
  }

  if(changerRole == "Owner"){
    businessMap.get(req.body.business_id).members[changeePos].role = req.body.newRole;
    res.status(200).send("Change Success");
  }
  else{
    res.status(401).send("Not Enough Permissions");
  }
}
});

app.put('/kickMember', async (req, res) => {                      //Expected: {business_id, kickerEmail, kickeeEmail, token}
  if(authMap.get(req.body.kickerEmail).token != req.body.token){
    res.status(400).send("Incorrect Token");
  }
  else{
    businessInfo = businessMap.get(req.body.business_id);          //Get data from business 'database'

    kickerRole = ""            //Make sure changer is owner (only owner can change roles)
    kickeeRole = ""           //Make sure kickee is under kicker
    kickerPos = ""            //Record position of employee with role 'to be changed'
  
    for(i = 0; i < businessInfo.members.length; i++){               //Check if user is already registered under the business
      if(businessInfo.members[i].email == req.body.kickerEmail){
        kickerRole = businessInfo.members[i].role;
      }
      else if(businessInfo.members[i].email == req.body.kickeeEmail){
        kickeeRole = businessInfo.members[i].role;
        kickeePos = i;
      }
    }

    if((kickerRole == "Owner") || (kickerRole == "Admin" && kickeeRole == "Employee")){
      businessInfo.members.splice(kickeePos, 1);            //Remove user from business

      kickeeEmail = req.body.kickeeEmail;
      userInfo = authMap.get(kickeeEmail);
      businessPos = 0;

      for(i = 0; i < userInfo.businesses.length; i++){
        if(userInfo.businesses[i].business_id == req.body.business_id){
          businessPos = i;
          break;
        }
      }
      userInfo.businesses.splice(businessPos, 1);           //Remove business from user info

      res.status(200).send("Kick Success");
    }
    else{
      res.status(403).send("Not Enough Permissions");
    }
  }
});

app.put('/businessOpen', async (req, res) => {                     //Expected Request {business_id, email, token}
  if(authMap.get(req.body.email).token != req.body.token){
    res.status(400).send("Incorrect Token");
  }
  else{
    businessInfo = businessMap.get(req.body.business_id);          //Get data from business 'database'

    for(i = 0; i < businessInfo.members.length; i++){               //Check if user is owner or admin
      if(businessInfo.members[i].email == req.body.email){
        role = businessInfo.members[i].role;
        if(role == "Owner" || role == "Admin"){
          if(businessInfo.businessOpened == true){
            res.status(400).send("Business Already Opened");
          }
          else{
            businessInfo.businessOpened = true;
            res.status(200).send("Business Opened");
          }
        }
      }
    }
  }
});

app.put('/businessClose', async (req, res) => {                     //Expected Request {business_id, email, token}
  if(authMap.get(req.body.email).token != req.body.token){
    res.status(400).send("Incorrect Token");
  }
  else{
    businessInfo = businessMap.get(req.body.business_id);          //Get data from business 'database'

    for(i = 0; i < businessInfo.members.length; i++){               //Check if user is owner or admin
      if(businessInfo.members[i].email == req.body.email){
        role = businessInfo.members[i].role;
        if(role == "Owner" || role == "Admin"){
          if(businessInfo.businessOpened == false){
            res.status(400).send("Business Already Closed");
          }
          else{
            businessInfo.businessOpened = false;
            res.status(200).send("Business Closed");
          }
        }
      }
    }
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App is listening on Port ${port}`));