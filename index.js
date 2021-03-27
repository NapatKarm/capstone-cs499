require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { 
  cors: {
    origins: "*"
  }
});
const redisadapter = require('socket.io-redis');
const Redis = require("ioredis");
const ioredis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
});
io.adapter(redisadapter({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  auth_pass: process.env.REDIS_PASSWORD
}));

const axios = require('axios');
const cors = require('cors');
const {v4: uuidv4} = require('uuid');

/////////////////////////////////////SWAGGER/////////////////////////////

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'C-Vivid Express API Documentation',
    version: '1.0.0',
  },
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['index.js'],
};

const swaggerSpec = swaggerJSDoc(options);

/////////////////////////////////////////////////////////////////////////////


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Connect to FireBase
var admin = require("firebase-admin");
var serviceAccount = require("./service-account.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://c-vivid-default-rtdb.firebaseio.com"
});

const db = admin.firestore();
// db.settings({ ignoreUndefinedProperties: true })
const usersdb = db.collection('users'); 
const busdb = db.collection('business');

app.get('/', function (req, res) {
  let time = Date();
  res.send(`Current Time: ${time}`);
});

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Signup User
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 description: The user's firstname.
 *               lastname:
 *                 type: string
 *                 description: The user's lastname.
 *               email:
 *                 type: string
 *                 description: The user's email.
 *               password:
 *                 type: string
 *                 description: The user's password.
 *     responses:
 *      '200':
 *        description: Successfully Created.
 *      '400':
 *        description: Email is already taken.
*/

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

/**
 * @swagger
 * /signin:
 *   post:
 *     summary: Sign in with user credientials
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *               password:
 *                 type: string
 *                 description: The user's password.
 *     responses:
 *       '200':
 *         description: Success.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 firstname:
 *                   type: string
 *                   description: The user's first name.
 *                 lastname:
 *                   type: string
 *                   description: The user's last name.
 *                 email:
 *                   type: string
 *                   description: The user's email.
 *                 token:
 *                   type: string
 *                   description: The user's token.
 *       '401':
 *         description: Incorrect Email or Password.
*/

// Sign-in Endpoint
app.post('/signin', async (req, res) => {         //Expected request: {email, password}
  let existing_user = await usersdb.where('email', '==', req.body.email.toLowerCase()).get(); // QuerySnapshot
  //For security reasons, you do not disclose whether email or password is invalid
  try {
    if(existing_user.empty) { 
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

/**
 * @swagger
 * /businessRegister:
 *   post:
 *     summary: Register a business
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               businessname:
 *                 type: string
 *                 description: The business' name.
 *               businessaddr:
 *                 type: string
 *                 description: The business' address.
 *               businesspass:
 *                 type: string
 *                 description: The business' passcode.
 *               email:
 *                 type: string
 *                 description: The business owner's email.
 *     responses:
 *       '200':
 *         description: Success.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 businessId:
 *                   type: integer
 *                   description: The business id.
 *                 businessname:
 *                   type: string
 *                   description: The business name.
 *                 businessaddr:
 *                   type: string
 *                   description: The business address.
 *                 businesspass:
 *                   type: string
 *                   description: The business pass.
 *                 isopened:
 *                   type: boolean
 *                   description: The business open/close status.
 *                 memberList:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       firstname:
 *                         type: string
 *                         description: The member's first name.
 *                       lastname:
 *                         type: string
 *                         description: The member's last name.
 *                       email:
 *                         type: string
 *                         description: The member's email.
 *                       role:
 *                         type: string
 *                         description: The member's role at the business.
 *       '400':
 *         description: Business Already Registered.
*/

// Business Register Endpoint
app.post('/businessRegister', async (req, res) => {     //Expected request: { businessname, businessaddr, owner_email, businesspass, first name, last name} (owner: email?)
  const existing_business = await busdb.where('businessaddr', '==', req.body.businessaddr).get();  //
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
        'memberList': [{                              //Member Info Structure
          'firstname': owner.docs[0].get('firstname'),
          'lastname': owner.docs[0].get('lastname'),
          'email': req.body.email.toLowerCase(),
          'role': 'Owner'
        }]
      }
      await busdb.add(businessInfo); 
      let counter_ref = busdb.doc("INCREMENTING_COUNTER");
      await counter_ref.update({ 
        counter: admin.firestore.FieldValue.increment(1)   // Really not intuitive because its different if using admin SDK 
      });

      owner_ref = usersdb.doc(owner.docs[0].id);
      await owner_ref.update({
        businessList: admin.firestore.FieldValue.arrayUnion(businessInfo.businessId)
      });
      res.status(200).send(businessInfo);
    } catch(error) {
      console.log(error);
    }
  }
});

/**
 * @swagger
 * /businessJoin:
 *   post:
 *     summary: Join a business as a new member
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *               businesspass:
 *                 type: string
 *                 description: The business passcode.
 *               businessId:
 *                 type: string
 *                 description: The business id.
 *     responses:
 *       '200':
 *         description: Success.
 *       '404':
 *         description: Business Not Found.
 *       '401':
 *         description: Incorrect Passcode.
 *       '400':
 *         description: User already registered.
*/

// Business Join Endpoint
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

/**
 * @swagger
 * /getBusinessData:
 *   post:
 *     summary: Retrieves business data
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *               token:
 *                 type: string
 *                 description: The user's generated token on signin.
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 businessList:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       businessId:
 *                         type: integer
 *                         description: The business id.
 *                       businessname:
 *                         type: string
 *                         description: The business name.
 *                       businessaddr:
 *                         type: string
 *                         description: The business address.
 *                       businesspass:
 *                         type: string
 *                         description: The business pass.
 *                       isopened:
 *                         type: boolean
 *                         description: The business open/close status.
 *                       memberList:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             firstname:
 *                               type: string
 *                               description: The member's first name.
 *                             lastname:
 *                               type: string
 *                               description: The member's last name.
 *                             email:
 *                               type: string
 *                               description: The member's email.
 *                             role:
 *                               type: string
 *                               description: The member's role at the business.
 *       '400':
 *         description: Incorrect Token.
*/

//Refresh
app.post('/getBusinessData', async (req, res) => {                   //Expected Request {email, token}
  let user_info = await usersdb.where('token', '==', req.body.token).get();
  console.log("Email", req.body.email);
  console.log("Token", req.body.token);
  if (user_info.empty) {
    res.status(400).send("Incorrect Token");
  }
  else{
    try{
      let arr_of_bus = await busdb.where('businessId', 'in', user_info.docs[0].get('businessList')).get();
      let bus_info = [];                // Must call doc.data() on each element because 
      arr_of_bus.docs.forEach(doc => {  // The actual array contains lots of meta data 
        bus_info.push(doc.data())
      });
      res.status(200).send(bus_info);   //Response: {businessList[{business_id, businessname, businessaddr, businesspass, memberList[{firstname, lastname, email, role}]}]}
    } catch (error) {
      console.log(error);
    }
  }
});

/**
 * @swagger
 * /getSingleBusinessData:
 *   post:
 *     summary: Retrieves business data for a single business
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               businessId:
 *                 type: string
 *                 description: The business' id.
 *               email:
 *                 type: string
 *                 description: The user's email.
 *               token:
 *                 type: string
 *                 description: The user's generated token on signin.
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 businessId:
 *                   type: integer
 *                   description: The business id.
 *                 businessname:
 *                   type: string
 *                   description: The business name.
 *                 businessaddr:
 *                   type: string
 *                   description: The business address.
 *                 businesspass:
 *                   type: string
 *                   description: The business passcode.
 *                 isopened:
 *                   type: boolean
 *                   description: The business open/close status.
 *                 memberList:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       firstname:
 *                         type: string
 *                         description: The member's first name.
 *                       lastname:
 *                         type: string
 *                         description: The member's last name.
 *                       email:
 *                         type: string
 *                         description: The member's email.
 *                       role:
 *                         type: string
 *                         description: The member's role at the business.
 *       '400':
 *         description: Incorrect Token.
 *       '403':
 *         description: You are not a part of this business.
*/

// Get Single Business Data Endpoint
app.post('/getSingleBusinessData', async (req, res) => {            //Expected: {business_id, email, token}
  let user_info = await usersdb.where('token', '==', req.body.token).where('email', '==', req.body.email.toLowerCase()).get();
  if (user_info.empty) {
    res.status(400).send("Incorrect Token");
    return;
  }

  let is_member = false;
  user_info.docs[0].get('businessList').forEach(business_id => {
    if (business_id == req.body.businessId) {
      is_member = true;
    }
  });
  if (is_member == false) {
    res.status(400).send("Not a member of this business");
    return;
  }

  try {
    let business_info = await busdb.where('businessId', '==', req.body.businessId).get();
    res.status(200).send(business_info.docs[0].data());  
    return;
  } catch (error) {
    console.log(error);
  }
});

/**
 * @swagger
 * /passcodeChange:
 *   put:
 *     summary: Change business passcode
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               businessId:
 *                 type: integer
 *                 description: The business id.
 *               email:
 *                 type: string
 *                 description: The user's email.
 *               token:
 *                 type: string
 *                 description: The user's token.
 *               businesspass:
 *                 type: string
 *                 description: The business' passcode.
 *     responses:
 *       '200':
 *         description: Change Success.
 *       '400':
 *         description: Incorrect Token.
 *       '401':
 *         description: Not Enough Permissions.
*/

// Passcode Change Endpoint
app.put('/passcodeChange', async (req, res) => {                    //Expected: { business_id, email, token, businesspass}
  let user_info = await usersdb.where('token', '==', req.body.token).where('email', '==', req.body.email.toLowerCase()).get();
  if(user_info.empty){
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


/**
 * @swagger
 * /roleChange:
 *   put:
 *     summary: Change employee role.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               businessId:
 *                 type: integer
 *                 description: The business id.
 *               changerEmail:
 *                 type: string
 *                 description: The changer's email.
 *               changeeEmail:
 *                 type: string
 *                 description: The changee's email.
 *               newRole:
 *                 type: string
 *                 description: The new role for the changee.
 *               token:
 *                 type: string
 *                 description: The user's token.
 *     responses:
 *       '200':
 *         description: Change Success.
 *       '400':
 *         description: Incorrect Token.
 *       '403':
 *         description: Not Enough Permissions.
*/

// Role Change Endpoint
app.put('/roleChange', async (req, res) => {                      //Expected: {business_id, (owners)changerEmail, changeeEmail, newRole, token}
  let user_info = await usersdb.where('token', '==', req.body.token).where('email', '==', req.body.changerEmail.toLowerCase()).get();
  if (user_info.empty) {
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

/**
 * @swagger
 * /kickMember:
 *   patch:
 *     summary: Kick member.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               businessId:
 *                 type: integer
 *                 description: The business id.
 *               kickerEmail:
 *                 type: string
 *                 description: The kicker's email.
 *               kickeeEmail:
 *                 type: string
 *                 description: The kickee's email.
 *               token:
 *                 type: string
 *                 description: The user's token.
 *     responses:
 *       '200':
 *         description: Kick Success.
 *       '400':
 *         description: Incorrect Token.
 *       '403':
 *         description: Not Enough Permissions.
*/

// Kick Member Endpoint
app.patch('/kickMember', async (req, res) => {                      //Expected: {business_id, kickerEmail, kickeeEmail, token}
  let kicker_info = await usersdb.where('token', '==', req.body.token).where('email', '==', req.body.kickerEmail.toLowerCase()).get();
  if (kicker_info.empty) {
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

    let kickee_info = await usersdb.where('email', '==', req.body.kickeeEmail.toLowerCase()).get();
    let new_business_list = kickee_info.docs[0].get('businessList');
    let business_pos = "";

    for (let i = 0; i < new_business_list.length; i++) {
      if (new_business_list[i] == req.body.businessId) {
        business_pos = i;
      }
    }
    new_business_list.splice(business_pos, 1);

    let kickee_ref =  usersdb.doc(kickee_info.docs[0].id);

    try {
      await bus_ref.update({
        memberList : new_member_list
      });
      await kickee_ref.update({
        businessList : new_business_list
      });
      res.status(200).send("Kick Success");
    } catch(error) {
      console.log(error);
    }
  }
});

/**
 * @swagger
 * /businessOpen:
 *   patch:
 *     summary: Mark business as open
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               businessId:
 *                 type: integer
 *                 description: The business id.
 *               email:
 *                 type: string
 *                 description: The user's email.
 *               token:
 *                 type: string
 *                 description: The user's token.
 *     responses:
 *       '200':
 *         description: Business Opened.
 *       '404':
 *         description: Business Already Opened.
*/

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

/**
 * @swagger
 * /businessClose:
 *   patch:
 *     summary: Mark business as close
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               businessId:
 *                 type: integer
 *                 description: The business id.
 *               email:
 *                 type: string
 *                 description: The user's email.
 *               token:
 *                 type: string
 *                 description: The user's token.
 *     responses:
 *       '200':
 *         description: Business Closed.
 *       '404':
 *         description: Business Already Closed.
*/

app.patch('/businessClose', async (req, res) => {                     //Expected Request {business_id, email, token}
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

async function isPartofBusiness(businessId, socket_id){
  const memberList = await io.of('/').adapter.sockets(new Set([businessId]));
  for (let it = memberList.values(), socketID = null; socketID = it.next().value;) { // iterate through a SET
    if(socket_id == socketID){
      return true;
    }
  }
  return false;
}

io.on('connection', (socket) => {
  console.log(`user ${socket.id} has connected`);

  socket.leave(socket.id);

  socket.on('openBusiness', async ({businessId, businessname, businessaddr, limit, email, token}) => {
    const json = JSON.stringify({
      businessname: businessname,
      businessaddr: businessaddr,
      limit: limit
    });
    await ioredis.set(businessId, json);
    await ioredis.set(businessId.toString()+"counter", 0);

    await axios.patch(`https://${process.env.EXPRESS_HOST}/businessOpen`, {businessId: businessId, email: email, token: token})
    .then(res => {
      socket.emit('openResponse', {success: "Success"});
    })
    .catch(err => {
      socket.emit('openResponse', {error: "Error"});
    })
    console.log("open");
  });

  socket.on('closeBusiness', async ({businessId, email, token}) => {
    await ioredis.del(businessId);
    await ioredis.del(businessId.toString()+"counter");
    await axios.patch(`https://${process.env.EXPRESS_HOST}/businessClose`, {businessId: businessId, email: email, token: token})
    .then(res => {
      socket.emit('closeResponse', {success: "Success"});
    })
    .catch(err => {
      socket.emit('closeResponse', {error: "Error"});
    })
    console.log("close");
  });

  socket.on('joinTracker', async ({email, businessId}) => {
    if(await ioredis.exists(businessId)){
      console.log("join");
      socket.join(businessId);
      // const json = JSON.stringify({
      //   email: email
      // });
      await ioredis.set(socket.id, email);
      let business = await ioredis.get(businessId);
      let businessJson = JSON.parse(business);

      socket.emit('joinCheck', { 
        counter: await ioredis.get(businessId.toString()+"counter"),
        limit: businessJson.limit});
    }
    else{
      socket.emit('joinCheck', {error: "Business is closed"});
    }
  });

  socket.on('addCount', async ({businessId}) => {
    if(await isPartofBusiness(businessId, socket.id)){
      let business = await ioredis.get(businessId);
      let businessJson = JSON.parse(business);

      await ioredis.incr(businessId.toString()+"counter");

      console.log(await ioredis.get(businessId.toString()+"counter"));

      let time = Date();

      io.in(businessId).emit('updateCounter', {
        counter: await ioredis.get(businessId.toString()+"counter"),
        limit: businessJson.limit,
        changerEmail: await ioredis.get(socket.id),
        changerType: "Incremented",
        time: time
      });
    }
  });

  socket.on('removeCount', async ({businessId})=> {
    if(await isPartofBusiness(businessId, socket.id)){
      const businessCounter = await ioredis.get(businessId.toString()+"counter");
      let business = await ioredis.get(businessId);
      let businessJson = JSON.parse(business);

      if(businessCounter > 0){
        await ioredis.decr(businessId.toString()+"counter");
      }
      console.log(await ioredis.get(businessId.toString()+"counter"));

      let time = Date();

      io.in(businessId).emit('updateCounter', {
        counter: await ioredis.get(businessId.toString()+"counter"),
        limit: businessJson.limit,
        changerEmail: await ioredis.get(socket.id),
        changerType: "Decremented",
        time: time
      });
    }
  });

  socket.on('limitChange', async ({businessId, limit}) => {
    let business = await ioredis.get(businessId);
    let businessJson = JSON.parse(business);
    businessJson.limit = limit;
    business = JSON.stringify(businessJson);

    await ioredis.set(businessId, business);

    let time = Date();

    io.in(businessId).emit('updateCounter', {
      counter: await ioredis.get(businessId.toString()+"counter"),
      limit: businessJson.limit,
      changerEmail: await ioredis.get(socket.id),
      changerType: `Chagned limit to ${businessJson.limit}`,
      time: time
    })

    let newbusiness = await ioredis.get(businessId);
    let newBusinessJson = JSON.parse(newbusiness);
    console.log(newBusinessJson.limit);
  });

  socket.on('leaveBusiness', async ({businessId}) => {
    socket.leave(businessId);
    await ioredis.del(socket.id);
  });

  socket.on('getAllData', async () => {
    const rooms = await io.of('/').adapter.allRooms();
    var allData = []
    for(let it = rooms.values(), businessId = null; businessId = it.next().value;){
      let business = await ioredis.get(businessId);
      let counter = await ioredis.get(businessId.toString()+"counter");

      let businessJson = JSON.parse(business);
      businessJson.counter = counter;
      businessJson.businessId = businessId;
      allData.push(businessJson);
    }
    socket.emit('updateMap', allData);
  });

  socket.on('disconnect', async () => {
    const user = await ioredis.get(socket.id);
    if(user != null){
      await ioredis.del(socket.id);
    }
    console.log(`user ${socket.id} disconnected`);
  });
});

const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`App is listening on Port ${port}`));
