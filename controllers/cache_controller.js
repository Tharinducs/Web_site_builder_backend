const express = require("express");
var router = express.Router();
const passport = require("passport");
var Cache = require("../models/cache");


router.get(
    "/getbymobile",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      var key = req.query.key;
      console.log("req cache getmobile",req)
      Cache.get_users_cache_data(key, (err, sites) => {
        if (!err) {
          res.status(200).json({
            status: true,
            msg: "Reading Sites by mobile",
            data: sites,
          });
        } else {
          res.status(500).json({
            state: false,
            msg: "Something went wrong please try again!",
            data: JSON.stringify(err),
          });
        }
      });
    }
  );

  module.exports = router;