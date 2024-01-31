const express = require('express')

const app = express()

const cors = require('cors')

const mongoose = require('mongoose')

const cookieParser = require('cookie-parser')

const router = require('./routes/User-routes')

app.use(cors({credentials:true , origin: "http://localhost:3000"}))

app.use(cookieParser())

app.use(express.json())

const connectDB = async() =>{
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/auth")
        .then(()=>console.log("connected to database"))
    }catch(err){
        console.log(err)
    }
}
connectDB()

app.use('/api',router);

app.listen(5000,()=>{
    console.log("listening at port 5000");
})