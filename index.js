const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const passport = require("passport");
var user_controller = require("./controllers/user_controller");

var app = express();
app.use(helmet())

app.use(morgan('combined'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/uploads", express.static("public/api/static/images"));

app.use(function (req, res, next) {
    var allowedOrigins = ["http://localhost:3000"];
    var origin = req.headers.origin;
    console.log(origin);
    console.log(allowedOrigins.indexOf(origin) > -1);
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

app.listen(8080, ()=> {
    console.log('Server started at port : 8080')
});

app.use("/api/user", user_controller);

