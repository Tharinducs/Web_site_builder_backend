const secret = require("../_helpers/constant").SECRET_OR_KEY;
const express = require("express");
var router = express.Router();
var Website = require("../models/websites");
const passport = require("passport");
const { check, validationResult } = require("express-validator");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null,  "./public/api/static/images");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g,'-') + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  //reject file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 //1Mb
  },
  fileFilter: fileFilter
});

router.post("/images", upload.array("uploadedImages",10), (req, res, next) => {
  const array = req.files.map((item)=>{
    return item.filename
  })
  res.status(200).json({
    status: true,
    files: array,
  });
});

router.post(
  "/createwebsite",
  passport.authenticate("jwt", { session: false }),
  [
    check("type")
      .exists()
      .isString()
      .isAlpha()
      .withMessage("Must be alphabetical Chars"),
    check("cname")
      .exists()
      .isString()
      .withMessage("Company name is required"),
    check("about").exists().isString().withMessage("About is required"),
    check("address").exists().isString().withMessage("Address is required"),
    check("email")
      .exists()
      .isEmail()
      .normalizeEmail()
      .withMessage("should be something like user@gmail.com"),
    check("pnumber")
      .exists()
      .isString()
      .withMessage("Mobile Number is required"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      let website = {
        type: req.body.type,
        companyName: req.body.cname,
        about: req.body.about,
        address: req.body.address,
        email: req.body.email,
        mobile: req.body.pnumber,
        userId: req.body.userId,
        uploads: req.body.uploads
      };
      try {
        Website.get_drft_by_user_id(req.body.userId, (err, draft_sel) => {
          if (Object.keys(draft_sel).length != 0) {
            Website.delete_drft_by_user_id(req.body.userId);
            Website.save_websites(website, (err, website) => {
              if (!err) {
                res.status(200).json({
                  status: true,
                  msg: "Succesfully created!",
                  website: website,
                });
              } else {
                res.status(500).json({
                  state: false,
                  msg: err || "Something went wrong please try again!",
                });
              }
            });
          } else {
            Website.save_websites(website, (err, website) => {
              if (!err) {
                res.status(200).json({
                  status: true,
                  msg: "Succesfully created!",
                  website: website,
                });
              } else {
                res.status(500).json({
                  state: false,
                  msg: err || "Something went wrong please try again!",
                });
              }
            });
          }
        });
      } catch (err) {
        res.status(500).json({
          state: false,
          msg: err || "Something went wrong please try again!",
          err: err,
        });
      }
    }
  }
);

router.post(
  "/createdraft",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let website = {
      type: req.body.type,
      companyName: req.body.cname || null,
      about: req.body.about || null,
      address: req.body.address || null,
      email: req.body.email || null,
      mobile: req.body.pnumber || null,
      userId: req.body.userId,
    };

    try {
      Website.get_drft_by_user_id(req.body.userId, (err, draft_sel) => {
        if (Object.keys(draft_sel).length != 0) {
          Website.update_draft(website, draft_sel[0].id, (err, website) => {
            if (!err) {
              res.status(200).json({
                status: true,
                msg: "Succesfully created the draft!",
                website: website,
              });
            } else {
              res.status(500).json({
                state: false,
                msg: err|| "somthing went wrong please try again!",
              });
            }
          });
        } else {
          Website.save_drafts(website, (err, website) => {
            if (!err) {
              res.status(200).json({
                status: true,
                msg: "Succesfully created the draft!",
                website: website,
              });
            } else {
              res.status(500).json({
                state: false,
                msg: err|| "somthing went wrong please try again!",
              });
            }
          });
        }
      });
    } catch (err) {
      res.status(500).json({
        state: false,
        msg: err|| "somthing went wrong please try again!",
      });
    }
  }
);

router.get("/getdrftsbyuserid",passport.authenticate("jwt", { session: false }),(req,res)=>{
    var id = req.query.userId;
    try{
        Website.get_drft_by_user_id(id, (err, draft_sel) => {
            if (!err) {
                res.status(200).json({
                  status: true,
                  draftSel:draft_sel
                });
              } else {
                res.status(500).json({
                  state: false,
                  msg: "Something went wrong please try again!",
                });
              }
        })
    }catch(err){
        res.status(500).json({
            state: false,
            msg: "Something went wrong please try again!",
            err:err
          });
    }
})

router.get("/getwebsitesbyuserid",passport.authenticate("jwt", { session: false }),(req,res)=>{
    var id = req.query.userId;
    try{
        Website.get_websites_by_user_id(id, (err, websites_sel) => {
            if (!err) {
                res.status(200).json({
                  status: true,
                  websitesSel:websites_sel
                });
              } else {
                res.status(500).json({
                  state: false,
                  msg: "Something went wrong please try again!",
                });
              }
        })
    }catch(err){
        res.status(500).json({
            state: false,
            msg: "Something went wrong please try again!",
            err:err
          });
    }
})

router.get("/getwebsitebyid",passport.authenticate("jwt", { session: false }),(req,res)=>{
  var id = req.query.id;
  try{
      Website.get_website_by_id(id, (err, websites_sel) => {
          if (!err) {
              res.status(200).json({
                status: true,
                websiteSel:websites_sel[0]
              });
            } else {
              res.status(500).json({
                state: false,
                msg: "Something went wrong please try again!",
              });
            }
      })
  }catch(err){
      res.status(500).json({
          state: false,
          msg: "Something went wrong please try again!",
          err:err
        });
  }
})

router.put("/updateWebsite",passport.authenticate("jwt", { session: false }),(req,res)=>{
    let website = {
        id:req.body.id,
        type: req.body.type,
        companyName: req.body.cname,
        about: req.body.about,
        address: req.body.address ,
        email: req.body.email,
        mobile: req.body.pnumber,
        userId: req.body.userId,
        uploads: req.body.uploads
      };

    try{
        Website.update_website(website,(err, website) =>{
            if (!err) {
                res.status(200).json({
                  status: true,
                  msg:"Successfully Updated!"
                });
              } else {
                res.status(500).json({
                  state: false,
                  msg: err || "Something went wrong please try again!",
                });
              }
        })
    }catch(err){
        res.status(500).json({
            state: false,
            msg: err || "Something went wrong please try again!",
            err:err
          });
    }
})

router.post("/resetpassword",(req,res)=>{
    
})

module.exports = router;
