const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {hashedPassword} = require('../helpers/password')
const JWT_SECRET_KEY = "MyKey"
const signup = async(req,res,next)=>{
    const {name,email,password} = req.body;
    let existinguser;
    try{
        existinguser = await User.findOne({email:email})
        
    }catch(err){
        console.log(err)
    }
    if(existinguser){
        return res.status(400).json({message:'user already exists,please Login'})
    }
    
    
    const hashPassword = await hashedPassword(password)
    
    const user = new User({
        name, //acts as name:name due to ES6 feature
        email,
        password : hashPassword

    })

    
    try{
       await user.save()
    }
    catch(err){
        console.log(err);
    }

    return res.status(201).json({message:"user successfully registered , please login..",user})

}

//login

const login = async(req,res,next) => {
    const {email,password} = req.body

    let existinguser;
    try{
        existinguser = await User.findOne({email:email});
    }catch(err){
        return new Error(err)
    }
    if(!existinguser){
        return res.status(400).json({message:"User not Found,Please Signup"})
    }

    const isPasswordCorrect = bcrypt.compareSync(password,existinguser.password)

    if(!isPasswordCorrect){
        return res.status(400).json({message:"Invalid Email / Password"})
    }

    const token = jwt.sign({id:existinguser._id},JWT_SECRET_KEY,{
        expiresIn:'35s'
    })

    console.log("New Token Generated\n",token)

    if(req.cookies[`${existinguser._id}`]){
        req.cookies[`${existinguser._id}`] = ""
    }

    res.cookie(String(existinguser._id),token,{
        path:'/',
        expires: new Date(Date.now() + 1000 * 30),
        httpOnly: true,
        sameSite: 'lax'
    })

    return res.status(200).json({message:"User Successfully Logged in...",user:existinguser,token})
}

const verifyToken = (req,res,next) =>{

    const cookies = req.headers.cookie;
    const token = cookies.split("=")[1]
    console.log(token)

    if(!token){
        return res.send(400).json({message:"Token not Found"})
    }

    jwt.verify(String(token),JWT_SECRET_KEY , (err,user)=>{
        if(err){
            return res.status(400).json({message:"Invalid Token"})
        }
        console.log(user.id)
        req.id = user.id;
    })
    next();
}

const getuser = async(req,res,next) =>{
    const userId = req.id;
    let user;
    try{
        user = await User.findById(userId,"-password")
    }catch(err){
        return new Error(err)
    }
    if(!user){
        return res.status(404).json({message:"user not found"})
    }
    return res.status(200).json({user})
}

const refreshToken = (req,res,next) =>{
    const cookies = req.headers.cookie;
    const prevToken = cookies.split("=")[1];
    if(!prevToken){
        return res.status(400).json({massage:"Could not find Token"})
    }
    jwt.verify(String(prevToken) , JWT_SECRET_KEY , (err,user)=>{
        if(err){
            console.log(err)
            return res.status(403).json({massage:"Authentication Failed"})
        }
        res.clearCookie(`${user.id}`)
        req.cookies[`${user.id}`] = ""

        const token = jwt.sign({id: user.id},JWT_SECRET_KEY,{
            expiresIn:"35s"
        })

        console.log("Regenerated Token Again\n",token)

        res.cookie(String(user.id),token,{
            path:'/',
            expires: new Date(Date.now() + 1000 * 30),
            httpOnly: true,
            sameSite: 'lax'
        })
        req.id = user.id
        next()
    })
}

const logout = (req,res,next) =>{
    const cookies = req.headers.cookie;
    const prevToken = cookies.split("=")[1];
    if(!prevToken){
        return res.status(400).json({massage:"Could not find Token"})
    }
    jwt.verify(String(prevToken) , JWT_SECRET_KEY , (err,user)=>{
        if(err){
            console.log(err)
            return res.status(403).json({massage:"Authentication Failed"})
        }
        res.clearCookie(`${user.id}`)
        req.cookies[`${user.id}`] = ""

        return res.status(200).json({message:"Successfully loggedout"})
    })
}

exports.signup = signup;
exports.login = login;
exports.verifyToken = verifyToken;
exports.getuser = getuser;
exports.refreshToken = refreshToken;
exports.logout = logout;