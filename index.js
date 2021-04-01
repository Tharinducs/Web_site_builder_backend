const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const passport = require("passport");
var user_controller = require("./controllers/user_controller");
var websites_controller = require("./controllers/websites_controller")

var app = express();
app.use(helmet()) //for security improvements

app.use(morgan('combined'));//to improve logs

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());//to accept json data

require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());//session managaement configurations
app.use("/api/uploads", express.static("public/api/static/images")); //create the uploads url to access static files

app.use(function (req, res, next) {
    var allowedOrigins = ["http://localhost:3001"];
    var origin = req.headers.origin;
    // Website you wish to allow to
    if (allowedOrigins.indexOf(origin) > -1) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
  
    // res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
  
    // Request methods you wish to allow
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
  
    // Request headers you wish to allow
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type,Authorization"
    );
  
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", true);
  
    // Pass to next layer of middleware
    next();
  });


//starting the app
app.listen(3011, ()=> {
    console.log('Server started at port : 8080')
});

//url configurations to accept http requests
app.use("/api/user", user_controller);
app.use("/api/website",websites_controller)

