var bcrypt = require("bcryptjs");
var sql = require("../config/db");

module.exports.get_user_by_username = (username, callback) => {
  sql.query("SELECT * FROM users WHERE username='" + username + "'", callback);
};

module.exports.get_by_user_id = (id,callback) =>{
  console.log(id,"id")
  sql.query("SELECT id,username,email FROM users WHERE id='" + id + "'",callback)
}

//
module.exports.passwordCheck = (plainpassword, hash, callback) => {
  bcrypt.compare(plainpassword, hash, (err, res) => {
    if (err) {
      throw err;
    } else {
      callback(null, res);
    }
  });
};

module.exports.change_password = (password, user_id, callback) => {
  bcrypt.hash(password, 10, (err, hash) => {
    password = hash;
    if (err) {
      throw err;
    } else {
      console.log(password);

      sql.query(
        "UPDATE users SET password = '" +
          password +
          "' WHERE user_id = '" +
          user_id +
          "'",
        callback
      );
    }
  });
};

module.exports.save_user = (user, callback) => {
  bcrypt.hash(user.password, 10, (err, hash) => {
    user.password = hash;
    if (err) {
      throw err;
    } else {
      console.log(user.password);

      sql.query("INSERT INTO users set ?", user, callback);
    }
  });
};