const express = require('express')
const dotenv= require('dotenv')
const mongoose= require('mongoose')

const app=express();

//import routes
const authRoute= require('./routes/auth')
const postRoute=require('./routes/posts')

dotenv.config();

//connect to db
mongoose.connect(process.env.DB_CONNECT,{ useNewUrlParser: true},
()=>{
    console.log(mongoose.connection.readyState)
    console.log('Connected to Database')
});


//Middleware
app.use(express.json());
//Route Middleware
app.use('/api/user', authRoute)
app.use('/api/posts', postRoute)

app.listen(3000, ()=> console.log(`Server Running`))