"user strict";

var mysql = require("mysql");

//local mysql db connection
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "website_builder"
});



connection.connect(function(err) {
  if (!err) {
    console.log("Database connection succeeded...!");
  } else {
    console.log("Error in DB connection :" + JSON.stringify(err, undefined, 2));
  }
});

module.exports = connection;

