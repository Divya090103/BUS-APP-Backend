var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
const cors = require('cors')
const bus=require('./models/Buses')


var app = express();


// Login and Register 
require('./auth/auth');
const login = require('./routes/login')
const loggedInPage = require('./routes/loggedInUser');
// ----------------------------------------------------

const bookingRoute = require('./routes/routeSelection')

var registerRouter = require('./routes/register');
//--------------------------------------------------------


//DB Config
const DB_URL = require('./config/keys').MongoURI;

//connect to mongo
//---------------------------------------------
mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(async() => {
        console.log("Connected to MongoDB")
        const buses = await bus.find({ startCity: "Chennai", destination: "Hyderabad" });

        console.log("Buses found:", buses);

    })
    .catch(err => {
        throw err
    })
//---------------------------------------------


app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
    origin: "https://bus-app-frontend-azure.vercel.app", // Replace with your frontend URL
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));
app.use('/', login);
app.use('/booking', bookingRoute);
app.use('/register', registerRouter);  // To register page 
app.use('/user', passport.authenticate('jwt', { session: false }), loggedInPage); //To Secure Route

module.exports = app;
