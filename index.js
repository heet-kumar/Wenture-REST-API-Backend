// calling expres framework 
const express = require('express');
const app = express();

// calling all the necessaary requirments of the app
const mongoose = require('mongoose');           // for sending and recieving data from the MongoDB
const dotenv = require('dotenv');               // for the use of the secret API keys
const helmet = require('helmet');               // securing our API request
const morgan = require("morgan");               // it is used for know the status of the API request
const userRoute = require("./routes/users");     // user route
const authRoute = require("./routes/auth");     // auth route
const postRoute = require("./routes/post");     // post route

dotenv.config();

//mogonDB connection 
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB Database connected successfully!!!!"))
.catch((err)=>console.log(err));


//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use('/api/users',userRoute);         // calling middleware for users Route
app.use('/api/auth',authRoute);          // calling middleware for auth Route
app.use('/api/posts',postRoute);         // calling middleware for posts Route  

// api calls 

app.get("/",(req,res)=>{
    res.send("Welcome to Home page");
})

app.get("/users",(req,res)=>{
    res.send("Welcome to user page");
})

// connection to the port 
app.listen(8800,()=>{
    console.log("Backend server is running!!!!")
})