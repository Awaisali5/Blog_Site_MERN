const express = require("express");
const cors = require("cors");
const { connect } = require("mongoose");
require("dotenv").config();
const upload= require('express-fileupload')

const userRoutes = require('./Routes/userRoute')
const postRoutes = require('./Routes/postRoute')

const {notFound, errorMiddleware} = require('./middleware/errorMiddleware')


const app = express();


// basic app setup 

app.use(express.json({extended: true}))
app.use(express.urlencoded({extended:true}))
app.use(cors({credentials:true, origin: "http://localhost:3000", methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',}))
app.use(upload())
app.use('/uploads', express.static(__dirname + '/uploads'))


// router 

app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)

// middleware
app.use(notFound) 
app.use(errorMiddleware) 

port = process.env.PORT || 5000

connect(process.env.MONGO_URL)
  .then(app.listen(port, () => console.log(`Server Running on Port ${port}`)))
  .catch((error) => console.log(error));
