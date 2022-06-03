const router = require('express').Router()
const User= require('../models/User')
const bcrypt= require('bcryptjs')
const jwt=require('jsonwebtoken')
const {registerValidation, loginValidation} = require('../validation')


// Register
router.post('/register', async (req,res)=>{

    //validate before sending a user
    let { error, value } = registerValidation(req.body);
    if (error)return res.status(400).send(error.details[0].message);

    // Checking if the user is already in the database
    const emailExist = await User.findOne ( { email : req.body.email } ) ;
    if (emailExist) return res.status (400) .send (' Email already exists ') ;

    //Hash Passwords
    const salt =  await bcrypt.genSalt (10) ;
    const hashedPassword = await bcrypt.hash (req.body.password , salt) ;
        
    // create new user
    const user= new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })
    try {
        const savedUser = await user.save();
        res.send({user: user._id})
    } catch (err){
        res.status(400).send(err);
    }
});

//Login
router.post('/login', async(req,res) => {
    //validate before sending a user
    let { error, value } = loginValidation(req.body);
    if (error)return res.status(400).send(error.details[0].message);

    // Checking if the user is already in the database
    const user = await User.findOne ({email : req.body.email}) ;
    if (!user) return res.status (400) .send ('Email or password is wrong') ;
    
    //Password check
    const validPass = await bcrypt.compare (req.body.password , user.password) ;
    if (!validPass) return res.status (400) .send ('Email or password is wrong')

    const token= jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token);

    //res.send('Logged in !') 

}) 

module.exports =router;