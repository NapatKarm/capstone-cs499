const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
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
app.get('/', async function (req, res) {
  let data = {
    'test' : 1,
    'param2' : 2
  };
  let test = await busdb.add(data);
  let test_ref = await test.collection('logs').add(data);
  console.log(test_ref);
  // user_info = await usersdb.where('email', '==', req.body.email).get();
  // user_bus = await busdb.where('bussinessid', 'in', user_info.docs[0].get(businessList)).get();
  // user_bus.forEach(doc => {
  //   console.log(doc.data())
//   });
  // some_bus = await busdb.where('businessId', 'in', [0, 1]).get();
  // some_bus.docs.forEach(doc => {
  //   console.log(doc.data())
  // });
  // some_bus_ref = busdb.doc(some_bus.docs[0].id);
  // new_member = {                             
  //   'firstname': "testing",
  //   'lastname': "123 test",
  //   'email': "some test email",
  //   'role': 'Employee'
  // };
  // try {
  //   some_bus_ref.update({                                            // Add business info to user's business[]
  //     memberList: admin.firestore.FieldValue.arrayUnion(new_member)
  //   });
  //   console.log("sucessfully updated array");
  //   some_bus = await busdb.where('businessId','==', 0).get();
  //   res.send(some_bus.docs[0].get('memberList'));
  // } catch (error) {
  //   console.log(error);
  // }

  // res.send('hello world');
});

// Sign-up end point
app.post('/signup', async (req, res) => {  //Expected request: {firstname, lastname, email, password}
  var existing_user = await usersdb.where('email', '==', req.body.email.toLowerCase()).get();
  if(!existing_user.empty) {               //Email is taken
    res.status(422).send('Email already in use');
  }
  else{
    const userInfo = {                     //User Info Structure
      'firstname': req.body.firstname,
      'lastname': req.body.lastname,
      'email': req.body.email.toLowerCase(),
      'password': req.body.password,
      'token': uuidv4(),
      'businessList': []  // Store's the businessList' id  
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
  let existing_user = await usersdb.where('email', '==', req.body.email.toLowerCase()).get(); // QuerySnapshot
  //For security reasons, you do not disclose whether email or password is invalid
  try {
    if (existing_user.empty) { 
      res.status(422).send('Invalid email or password');
    }
    else if (!existing_user.empty && (existing_user.docs[0].get('email') != req.body.email.toLowerCase()) || (existing_user.docs[0].get('password') !=  req.body.password)) {
      res.status(422).send('Invalid email or password');
    }
    else {
      let new_token = uuidv4();
      let user_ref =  usersdb.doc(existing_user.docs[0].id);
      await user_ref.update({
        token : new_token
      });
      existing_user = await usersdb.where('email', '==', req.body.email.toLowerCase()).get(); // Requery to get newly updated token value
      existing_user = existing_user.docs[0].data();
      delete existing_user['password'];
      delete existing_user['businessList'];
      res.status(200).send(existing_user);
      console.log('Successful Log In')
    }
  } catch(error) {
    console.log(error);
  }
});

// Business Register Endpoint
app.post('/businessRegister', async (req, res) => {     //Expected request: { businessname, businessaddr, owner_email, businesspass, first name, last name} (owner: email?)
  const existing_business = await busdb
    .where('businessaddr', '==', req.body.businessaddr)
    .where('lat', '==', req.body.lat)
    .where('long', '==', req.body.long)
    .get();  
  const owner = await usersdb.where('email','==', req.body.email.toLowerCase()).get();                           // Owner's Information
  if (!existing_business.empty) {   //Business already registered, cannot have 2 businessList on same address
    res.status(400).send('Business Already Registered');
  }
  else {
    try {
      const incrementing_id = await busdb.where('counter', '>=', 0).get();
      const businessInfo = {                       //Business Info Structure
        'businessname': req.body.businessname,
        'businessaddr': req.body.businessaddr,
        'businessId' : incrementing_id.docs[0].get('counter'),
        'businesspass': req.body.businesspass,
        'isopened' : false,
        'lat' : req.body.lat,
        'long' : req.body.long,
        'memberList': [{                              //Member Info Structure
          'firstname': owner.docs[0].get('firstname'),
          'lastname': owner.docs[0].get('lastname'),
          'email': req.body.email.toLowerCase(),
          'role': 'Owner'
        }]
      }

      // When calling db.collection(), a collection is created if it does not exist. 
      bus_ref = await busdb.add(businessInfo); 
      let businessLogs = {
        'date' : "",
        'actions' : []
      };
      bus_logs = await bus_ref
        .collection('logs')
        .add(businessLogs);

      let counter_ref = busdb.doc("INCREMENTING_COUNTER");
      await counter_ref.update({ 
        counter: admin.firestore.FieldValue.increment(1)   // Really not intuitive because its different if using admin SDK 
      });

      owner_ref = usersdb.doc(owner.docs[0].id);
      await owner_ref.update({
        businessList: admin.firestore.FieldValue.arrayUnion(businessInfo.businessId)
      });

      res.status(200).send("Success");
    } catch(error) {
      console.log(error);
    }
  }
});

app.post('/businessJoin', async (req, res) => {                    //Expected request: {email, businesspass, businessId}
  const existing_business = await busdb.where('businesspass', '==', req.body.businesspass).where('businessId', '==', req.body.businessId).get();
  if (existing_business.empty) {                                       // Non-existing Business, false = empty document
    res.status(400).send('Business does not exist');
    return;
  }

  let member_list = existing_business.docs[0].get('memberList');
  for (let i = 0; i < member_list.length; i++) {       // Check if member already exists in a business
    if (member_list[i].email == req.body.email.toLowerCase()) {
      res.status(422).send('User already is a member');
      return;
    }
  }  
  
  const new_member_info = await usersdb.where('email', '==', req.body.email.toLowerCase()).get();       // Get the to-be-added employee's info from userdb and make an object                                                                                                     
  const new_member = ({                                   // Will be added to the business' member array
    'firstname': new_member_info.docs[0].get('firstname'),
    'lastname': new_member_info.docs[0].get('lastname'),
    'email': req.body.email.toLowerCase(),
    'role': 'Employee'
  });

  const bus_info = existing_business.docs[0].get('businessId');   // Business id 
 
  let bus_ref = busdb.doc(existing_business.docs[0].id);         // References for pushing new data to arrays
  let user_ref = usersdb.doc(new_member_info.docs[0].id);
  try { 
    await bus_ref.update({
      memberList: admin.firestore.FieldValue.arrayUnion(new_member) // Add new member's info to business' member[]
    });
    await user_ref.update({                                            // Add business id to user's business[]
      businessList: admin.firestore.FieldValue.arrayUnion(bus_info)
    });
    res.status(200).send('Successfully Joined'); 
  } catch (error) {
    console.log(error);
  }
});

//Refresh
app.get('/getBusinessData', async (req, res) => {                   //Expected Request {email, token}
  let user_info = await usersdb.where('token', '==', req.body.token).get();
  if (user_info.docs[0].get('token') != req.body.token) {
    res.status(400).send("Incorrect Token");
  }
  else{
    try {
      let bus_info = [];   // Must call doc.data() on each element because the actual array contains lots of meta data 
      let query_array = [];
      const user_bus_list = user_info.docs[0].get('businessList');
  
      for (let i = 0; i < Math.ceil( user_info.docs[0].get('businessList').length / 10 ); i++) {  // Handle membership of > 10 businesses
        let j = 0;
        let k = 9;
        if (user_bus_list.length < 10) {
          k = user_bus_list.length;
        }
        query_array = user_bus_list.slice(j, k); // 0 - 9, 10 - 19, 20 - 29, etc.
        let arr_of_bus = await busdb.where('businessId', 'in', query_array).get();          
        arr_of_bus.docs.forEach(doc => {  
          bus_info.push(doc.data())
        });
        j = j + 9;
        if (j + 10 > user_bus_list.length) {  // If the range extends the length of the array, set k equal to the remaining elements
          k = user_bus_list.length - j - 1
        } else {
          k =  j + 10;
        }
      }
      res.status(200).send(bus_info);   //Response: {businessList[{business_id, businessname, businessaddr, businesspass, memberList[{firstname, lastname, email, role}]}]}
    } catch (error) {
        console.log(error);
    }
  }
});

app.get('/getSingleBusinessData', async (req, res) => {            //Expected: {business_id, email, token}
  let user_info = await usersdb.where('token', '==', req.body.token).where('email', '==', req.body.email.toLowerCase()).get();
  if (user_info.docs[0].get('token') != req.body.token) {
    res.status(400).send("Incorrect Token");
  }

  let is_member = false;
  user_info.docs[0].get('businessList').forEach(business_id => {
    if (business_id == req.body.businessId) {
      is_member = true;
    }
  });
  if (is_member == false) {
    res.status(400).send("Not a member of this business");
  }

  try {
    let business_info = await busdb.where('businessId', '==', req.body.businessId).get();
    res.status(200).send(business_info.docs[0].data());  
  } catch (error) {
    console.log(error);
  }
});

app.put('/passcodeChange', async (req, res) => {                    //Expected: { business_id, email, token, businesspass}
  let user_info = await usersdb.where('token', '==', req.body.token).where('email', '==', req.body.email.toLowerCase()).get();
  if(user_info.docs[0].get('token') != req.body.token){
    res.status(400).send("Incorrect Token");
    return;
  }
  else{
    let bus_info = await busdb.where('businessId', '==', req.body.businessId).get();
    let has_permissions = false;
    bus_info.docs[0].get('memberList').forEach(member => { // Check every member in the business and check for their roles
      if ((member.role == 'Owner' || member.role == 'Admin') && (member.email == req.body.email)) {
        has_permissions = true;
      }
    });
    if (has_permissions == false) {
      res.status(401).send("Not enough permissions");
      return;
    }

    bus_ref = busdb.doc(bus_info.docs[0].id);  // Ref for updating passcode
    try {
      await bus_ref.update({
        businesspass : req.body.businesspass
      });
      res.status(200).send("Change Success");
    } catch (error) {
      console.log(error);
    }
  }
});

app.put('/roleChange', async (req, res) => {                      //Expected: {business_id, (owners)changerEmail, changeeEmail, newRole, token}
  let user_info = await usersdb.where('token', '==', req.body.token).where('email', '==', req.body.changerEmail.toLowerCase()).get();
  if (user_info.docs[0].get('token') != req.body.token) {
    res.status(400).send("Incorrect Token");
    return;
  }
  else{
    let bus_info = await busdb.where('businessId', '==', req.body.businessId).get();
    let has_permissions = false;
    bus_info.docs[0].get('memberList').forEach(member => { // Check every member in the business and check for their roles
      if ((member.role == 'Owner' || member.role == 'Admin') && (member.email == req.body.changerEmail)) {
        has_permissions = true;
      }
    });
    if (has_permissions == false) {
      res.status(401).send("Not enough permissions");
      return;
    }
    
    new_member_list = bus_info.docs[0].get('memberList');
    for (let i = 0; i < new_member_list.length; i++) {
      if (new_member_list[i].email == req.body.changeeEmail) {
        new_member_list[i].role = req.body.newRole;
      }
    }

    bus_ref = busdb.doc(bus_info.docs[0].id);
    try {
      await bus_ref.update({
        memberList : new_member_list
      });
      res.status(200).send("Change Success");
    } catch(error) {
      console.log(error);
    }
  }
});

app.patch('/kickMember', async (req, res) => {                      //Expected: {business_id, kickerEmail, kickeeEmail, token}
  let kicker_info = await usersdb.where('token', '==', req.body.token).where('email', '==', req.body.kickerEmail.toLowerCase()).get();
  if (kicker_info.docs[0].get('token') != req.body.token) {
    res.status(400).send("Incorrect Token");
    return;
  }
  else {
    let bus_info = await busdb.where('businessId', '==', req.body.businessId).get();
    let has_permissions = false;
    let new_member_list = bus_info.docs[0].get('memberList');
    let kickee_pos = "";
    for (let i = 0; i < new_member_list.length; i++) {
      if (new_member_list[i].email == req.body.kickeeEmail) {
        kickee_pos = i;
      }
    }
    if (kickee_pos == "") {
      res.status(401).send("Kickee Email invalid or does not exist within the business");
      return;
    }
    bus_info.docs[0].get('memberList').forEach(member => { // If kicker's role is Owner OR kicker's role is admin AND kickee's role is Employee
      if (((member.role == 'Owner') || (member.role == 'Admin' && new_member_list[kickee_pos].email == 'Employee')) && (member.email == req.body.kickerEmail)) {
        has_permissions = true;
      }
    });
    if (has_permissions == false) {
      res.status(401).send("Not enough permissions");
      return;
    }
    new_member_list.splice(kickee_pos, 1);
    bus_ref = busdb.doc(bus_info.docs[0].id);
    try {
      await bus_ref.update({
        memberList : new_member_list
      });
      res.status(200).send("Kick Success");
    } catch(error) {
      console.log(error);
    }
  }
});

app.patch('/businessOpen', async (req, res) => {                     //Expected Request {business_id, email, token}
  let changer_info = await usersdb.where('token', '==', req.body.token).where('email', '==', req.body.email.toLowerCase()).get();
  if (changer_info.docs[0].get('token') != req.body.token || changer_info.empty) {
    res.status(400).send("Incorrect Token");
    return;
  }
  let bus_info = await busdb.where("businessId", '==', req.body.businessId).get();
  has_permissions = false;
  bus_info.docs[0].get('memberList').forEach(member => { // Check every member in the business and check for their roles
    if ((member.role == 'Owner' || member.role == 'Admin') && (member.email == req.body.email)) {
      has_permissions = true;
    }
  });
  if (has_permissions == false) {
    res.status(401).send("Not enough permissions");
    return;
  } 
  else if (bus_info.docs[0].get('isopened') == true) {
    res.status(400).send('Business Already Opened');
  } 
  else {
    let bus_ref = busdb.doc(bus_info.docs[0].id);
    try {
      await bus_ref.update({
        isopened : true
      });
      res.status(200).send('Business Opened');
    } catch(error) {
      console.log(error);
    }
  }
});

app.patch('/businessClose', async (req, res) => {                     //Expected Request {businessId, email, token}
  let changer_info = await usersdb.where('token', '==', req.body.token).where('email', '==', req.body.email.toLowerCase()).get();
  if (changer_info.docs[0].get('token') != req.body.token || changer_info.empty) {
    res.status(400).send("Incorrect Token");
    return;
  }
  let bus_info = await busdb.where("businessId", '==', req.body.businessId).get();
  has_permissions = false;
  bus_info.docs[0].get('memberList').forEach(member => { // Check every member in the business and check for their roles
    if ((member.role == 'Owner' || member.role == 'Admin') && (member.email == req.body.email)) {
      has_permissions = true;
    }
  });
  if (has_permissions == false) {
    res.status(401).send("Not enough permissions");
    return;
  } 
  else if (bus_info.docs[0].get('isopened') == false) {
    res.status(400).send('Business Already Closed');
  } 
  else {
    let bus_ref = busdb.doc(bus_info.docs[0].id);
    try {
      await bus_ref.update({
        isopened : false
      });
      res.status(200).send('Business Closed');
    } catch(error) {
      console.log(error);
    }
  }
});

// request :  
// { email, token, newPassword, 
app.patch("/changePassword", async (req, res) => {
  let user_info = await usersdb.where('password', '==', req.body.password).where('email', '==', req.body.email.toLowerCase()).get();
  if (user_info.empty) {
    res.status(400).send("Invalid username or password");
    return;
  }
  else {
    let user_ref = usersdb.doc(user_info.docs[0].id);
    try {
      await user_ref.update({
        password : req.body.password
      });
      res.status(200).send("Password successfully changed");
      return;
    } catch (err) {
      console.log(error);
    }
  }
});

app.delete('/businessDelete', async (req, res) => { // expected request: businessId, email, token
  let owner_info = await usersdb.where('token', '==', req.body.token).where('email', '==', req.body.email.toLowerCase()).get();
  if (owner_info.docs[0].get('token') != req.body.token || owner_info.empty) {
    res.status(400).send("Incorrect Token");
    return;
  } 
  else {
    let bus_info = await busdb.where('businessId', '==', req.body.businessId).get();
    let has_permissions = false;
    bus_info.docs[0].get('memberList').forEach( member => { 
      if ((member.role == 'Owner') && (member.email == req.body.email)) {
        has_permissions = true;
      }
    });
    if (has_permissions == false) {
      res.status(401).send("Not enough permissions");
      return;
    }
    
    try {
      // Iterate through bus' memberList and delete the business from their businessList
      bus_info.docs[0].get('memberList').forEach( async (member) => { 
        let member_info = await usersdb.where('email', '==', member.email).get();
        let member_ref = usersdb.doc(member_info.docs[0].id);
        await member_ref.update({
          businessList : admin.firestore.FieldValue.arrayRemove(req.body.businessId)
        });
      });
      let bus_ref = busdb.doc(bus_info.docs[0].id);
      await bus_ref.delete();
      console.log("Business Successfully Deleted");
      res.status(200).send("Business Successfully Deleted");
    } catch (error) {
      console.log(error);
    }
  }
});

app.get('/businessGraph', async (req, res) => {
    try {
        some_bus_id = await busdb.where('businessId', '==', req.body.businessId).get();
            
        the_id = some_bus_id.docs[0].id;
        bus_logs = await busdb.doc(the_id)
            .collection('logs')
            .where('date', '==', req.body.date)
            .get();

        bus_data = bus_logs.docs[0].data();
        // bus_logs.forEach( (doc) => {
        //     console.log(doc.data())
        // });
        console.log(bus_logs.size);
        console.log(bus_data);
        res.send(bus_data);
    } catch(error) {
        console.log(error);
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App is listening on Port ${port}`));