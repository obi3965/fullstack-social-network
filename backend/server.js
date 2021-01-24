const express = require('express')
const logger = require('morgan')
const cors = require('cors')
// const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')


require("dotenv").config();

const app = express()
const connectDB = require('./connection/db')
connectDB();





const authRoute = require('./routes/auth')
const postRoutes = require('./routes/post')
const userRoutes = require('./routes/user')


app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());


app.use('/api', authRoute)
app.use('/api', postRoutes);
app.use('/api', userRoutes);

const port = process.env.PORT;


 app.listen(port, ()=> {
    console.log(`Server started on port ${process.env.PORT}`);
});

