const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');      
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'Dipsisagoodb$oy';

// ROUTE 1: Create a User using: POST "/api/auth/createuser". No login required
router.post('/createUser', [

  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be atleast 7 characters').isLength({ min: 5 }),
], async (req, res) => {
  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  // console.log("hello")
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // Check whether the user with this email exists already
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: "Sorry a user with this email already exists" })
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    user = await User.create({
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      Role:"USER",
      Department:req.body.Department,
      password: secPass,
      email: req.body.email,
    });
    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);


    // res.json(user)
    res.json({ authtoken })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server 1 Error");
  }
})


router.post('/createAdmin', [
 
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // Check whether the user with this email exists already
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: "Sorry a user with this email already exists" })
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    user = await User.create({
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      Role:"ADMIN",
      Department:req.body.Department,
      password: secPass,
      email: req.body.email,
    });
    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);


    // res.json(user)
    res.json({ authtoken })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

// since fetchuser is used as middleware so authtoken is required in headers

// ROUTE 2: update admin 

router.put('/updateAdmin/:id', fetchuser, async (req, res) => {
  const { firstName, lastName,middleName, Department } = req.body;
  try {
    const user = await User.findById(req.user.id).select("-password")
    if(user.Role === "ADMIN"){

      // Create a newusers object
      const newUser = {};
      if (firstName) { newUser.firstName = firstName };
      if (middleName) { newUser.middleName = middleName };
      if (lastName) { newUser.lastName = lastName };
      if(Department){newUser.Department= Department}
     

      // Find the users to be updated and update it
      let users = await User.findById(req.params.id);
      if (!users) { return res.status(404).send("Not Found") }

      
      users = await User.findByIdAndUpdate(req.params.id, { $set: newUser }, { new: true })
      res.json({ users });
    }
    else{
      res.send("NOT ALLOWED")
    }
   
  } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
  }
})


// since fetchuser is used as middleware so authtoken is required in headers

// ROUTE 3: update user
router.put('/updateUser', fetchuser, async (req, res) => {
  const { firstName, lastName,middleName, Department } = req.body;
  try {
    
      // Create a newusers object
      const newUser = {};
      if (firstName) { newUser.firstName = firstName };
      if (middleName) { newUser.middleName = middleName };
      if (lastName) { newUser.lastName = lastName };
      if(Department){newUser.Department= Department}
     

      // Find the users to be updated and update it
      let users = await User.findById(req.user.id);
      if (!users) { return res.status(404).send("Not Found") }

      
      users = await User.findByIdAndUpdate(req.user.id, { $set: newUser }, { new: true })
      res.json({ users });
   
   
  } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
  }
})





// ROUTE 4: Get loggedin User Details using: POST "/api/auth/getuser". Login required
// since fetchuser is used as middleware so authtoken is required in headers

router.post('/getuser/:id', fetchuser,  async (req, res) => {
  console.log(req.user)
  try {
    
    const user = await User.findById(req.user.id).select("-password")
    if(user.Role==="ADMIN"){
      const info =await User.findById(req.params.id).select("-password") // if user is ADMIN he can see profile of anyone
      res.send(info)
    }
    else{
      const info =await User.findById(req.params.id).select("-password")
       if(info.Role === "ADMIN") {
         res.send("NOT ALLOWED")
       }
       else{
        res.send(info)
       }

    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})
module.exports = router