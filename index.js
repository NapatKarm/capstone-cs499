// require('dotenv').config();
const express = require('express');

const app = express();
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
//var admin = require("firebase-admin");

//var serviceAccount = require("./service-account.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://c-vivid-default-rtdb.firebaseio.com"
// });

app.get('/', function (req, res) {
  res.send('hello world')
});

//Declare Test/Temp Map ('database')
let authMap = new Map();

let businessMap = new Map();
let businessId = 0;

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

app.post('/signup', async (req, res) => {         //Expected request: {firstname, lastname, email, password}
  let toLowerEmail = req.body.email.toLowerCase();
  if(authMap.has(toLowerEmail)){                //Email is taken
    res.status(400).send("That email is taken. Try another.");
  }
  else{
    userInfo = {                                  //User Info Structure
      "firstname": req.body.firstname,
      "lastname": req.body.lastname,
      "email": toLowerEmail,
      "password": req.body.password,
      "businesses": []
    }
    authMap.set(toLowerEmail, userInfo);        //Add user info to 'database'
    res.status(200).send("Successfully registered");
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
 *                   description: The users first name.
 *                 lastname:
 *                   type: string
 *                   description: The users last name.
 *                 email:
 *                   type: string
 *                   description: The users email.
 *       '401':
 *         description: Incorrect Email or Password.
*/

app.post('/signin', async (req, res) => {         //Expected request: {email, password}
  let toLowerEmail = req.body.email.toLowerCase();
  if(authMap.has(toLowerEmail)){                //If existing email
    if(authMap.get(toLowerEmail).password == req.body.password){          //If correct password
      authMap.get(toLowerEmail).token = uuidv4();                         //Create Random UUID
      resInfo = Object.assign({}, authMap.get(toLowerEmail));             //delete password from data
      delete resInfo.password;
      delete resInfo.businesses;
      
      res.status(200).json(resInfo);              //Response: {firstname, lastname, email}
    }
    else{                                         //If Incorrect Password
      res.status(401).send("Incorrect Password");           
    }
  }
  else{                                           //If non-existing email
    res.status(404).send("Email Not Found");
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
 *                 business_id:
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
 *                 businessOpened:
 *                   type: boolean
 *                   description: The business open/close status.
 *                 members:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       firstname:
 *                         type: string
 *                         description: The members first name.
 *                       lastname:
 *                         type: string
 *                         description: The members last name.
 *                       email:
 *                         type: string
 *                         description: The members email.
 *                       role:
 *                         type: string
 *                         description: The members role at the business.
 *       '400':
 *         description: Business Already Registered.
*/

app.post('/businessRegister', async (req, res) => {     //Expected request: { businessname, businessaddr, email, businesspass}
  let addr = req.body.businessaddr;
  foundBusiness = false;
  for(let value of businessMap.values()){
    if(value.businessaddr == addr){
      foundBusiness = true;
    }
  }
  if(foundBusiness == true){           //Business already registered
    res.status(400).send("Business Already Registered");
  }
  else{
    businessId++;
    businessInfo = {                                    //Business Info Structure
      "business_id": businessId,
      "businessname": req.body.businessname,
      "businessaddr": req.body.businessaddr,
      "businesspass": req.body.businesspass,
      "businessOpened": false,
      "members": [{                                     //Member Info Structure
        "firstname": authMap.get(req.body.email).firstname,
        "lastname": authMap.get(req.body.email).lastname,
        "email": req.body.email,
        "role": "Owner"
      }]
    };
    businessMap.set(businessId, businessInfo);           //Add business data to business 'database'
    authMap.get(req.body.email).businesses.push(businessInfo);      //Add business data to user 'database' under businesses
    res.status(200).json(businessInfo);
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
 *               business_id:
 *                 type: string
 *                 description: The business id.
 *               role:
 *                 type: string
 *                 description: The user's role at the business.
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

app.post('/businessJoin', async (req, res) => {                     //Expected request: {email, businesspass, business_id}
  if(!businessMap.has(req.body.business_id)){                      //If non-existing business
    res.status(400).send("Business does not exist");
  }
  else if(req.body.businesspass != businessMap.get(req.body.business_id).businesspass){        //If incorrect passcode
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
        "role": "Employee"
      });
      userInfo.businesses.push(businessInfo);                       //Add business data to user 'database' under businesses

      res.status(200).send("Successfully Joined");
    }
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
 *                 business_id:
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
 *                 businessOpened:
 *                   type: boolean
 *                   description: The business open/close status.
 *                 members:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       firstname:
 *                         type: string
 *                         description: The members first name.
 *                       lastname:
 *                         type: string
 *                         description: The members last name.
 *                       email:
 *                         type: string
 *                         description: The members email.
 *                       role:
 *                         type: string
 *                         description: The members role at the business.
 *       '400':
 *         description: Incorrect Token.
*/

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

/**
 * @swagger
 * /businessOpen:
 *   put:
 *     summary: Mark business as open
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               business_id:
 *                 type: string
 *                 description: The business id.
 *     responses:
 *       '200':
 *         description: Business Opened.
 *       '404':
 *         description: Business Already Opened.
*/

app.put('/businessOpen', async (req, res) => {                     //Expected Request {business_id}
  let b_id = req.body.business_id;
  if(businessMap.get(b_id).businessOpened == true){
    res.status(400).send("Business Already Opened");
  }
  else{
    businessMap.get(b_id).businessOpened = true;
    res.status(200).send("Business Opened");
  }
});

/**
 * @swagger
 * /businessClose:
 *   put:
 *     summary: Mark business as close
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               business_id:
 *                 type: string
 *                 description: The business id.
 *     responses:
 *       '200':
 *         description: Business Closed.
 *       '404':
 *         description: Business Already Closed.
*/

app.put('/businessClose', async (req, res) => {                     //Expected Request {business_id}
  let b_id = req.body.business_id;
  if(businessMap.get(b_id).businessOpened == false){
    res.status(400).send("Business Already Closed");
  }
  else{
    businessMap.get(b_id).businessOpened = false;
    res.status(200).send("Business Closed");
  }
});


const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`App is listening on Port ${port}`));