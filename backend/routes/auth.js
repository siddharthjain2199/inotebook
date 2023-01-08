const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser')

const JWT_SECRET = 'Siddharth@jain'
// ROUTE 1: create a User using : POST "/api/auth/createuser". no login require
router.post('/createuser',[
    body('name','Enter a valid name').isLength({ min: 3 }),
    body('email','Enter a valid email').isEmail(),
    body('password','Enter a valid password').isLength({ min: 5 })
],async (req, res)=>{
  let success = false;

    // obj={
    //     a:'Sid',
    //     num : 34
    // }
    // res.json(obj)
   
    // console.log(req.body)
    // const user = User(req.body);
    // user.save();
    // res.send(req.body)

    //If there are errors, return bad request and the errors 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // check whether the user with this email exists already
    // User.create({
  try {
     let user = await User.findOne({email: req.body.email});
    if (user){
        return res.status(400).json({success, error: "Sorry a user with the email already exists"})
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password,salt)

    user = await User.create({
        name: req.body.name,
        email: req.body.email,
        // password: req.body.password,
        password: secPass
      })
    //   .then(user => res.json(user))
    //   .catch(err=>{console.log(err)
    //   res.json({error:'Please enter a unique value',message : err.message})});
    const data ={
      user:{
        id:user.id
      }
    }
    const authToken = jwt.sign(data,JWT_SECRET);
    // console.log(authToken)  
    // res.json(user)
    success = true;
    res.json({success, authToken})
    }
    catch(error){
        console.log(error)
        res.status(500).send("Some error occured")
    }
})

//ROUTE 2: authenticate a User using : POST "/api/auth/login". no login require
router.post('/login',[
  body('email','Enter a valid email').isEmail(),
  body('password','password can not be blank').exists()
],async (req, res)=>{
  let success = false;
   //If there are errors, return bad request and the errors 
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     return res.status(400).json({ errors: errors.array() });
   }

   //destructuring
   const {email,password} = req.body
   try {
    let user = await User.findOne({email});
    if(!user){
      success = false
      return res.status(400).json({error:"please try to login with correct creds"});
    } 

    const passwordCompare = await bcrypt.compare(password, user.password);

    if(!passwordCompare){
      success = false
      return res.status(400).json({success, error:"please try to login with correct creds"});
    }

    const data ={
      user:{
        id:user.id
      }
    }
    const authToken = jwt.sign(data,JWT_SECRET);
    success = true;
    res.json({success, authToken})

   } catch (error) {
    console.log(error)
    res.status(500).send("Internal Server Error")
   }
})

//ROUTE 3: get user loggedin User details using : POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser ,async (req, res)=>{
try {
  userId = req.user.id;
  const user = await User.findById(userId).select("-password")
  res.send(user)
} catch (error) {
  console.log(error)
  res.status(500).send("Internal Server Error")
}
})
module.exports = router