var express = require('express');
var router = express.Router();
var User = require("../model/user");
var auth = require("../authentication/auth");



router.get("/", function(req,res,next){
  res.render("index");
})

/* GET home page. */
router.post('/', function(req, res, next) {
  User.create(req.body,(err,user)=>{
    if(err){console.log("err while creating user"+ err)}
    var token = auth.generateJWT(user);
    var userinfo = {
        email : user.email,
        token : token,
        username : user.username,
    }
    res.json({userinfo});
  })
});

router.post("/login",function(req, res, next){
  var email = req.body.email;
    var password = req.body.password;
    if(!email  || !password){
        return res.status(400).json({error : "email / password required"});
    }
    User.findOne({email},(err,user)=>{
        if(err){
            return res.status(400).json({error : "Invalid User"})
        }

        if(!user){return res.status(400).json({err : "no user found"})};

        if(!user.verifyPassword(password)){
            return res.status(400).json({err :"enter valid password"});
        }
        var token1 = auth.generateJWT(user);
        var updatedUser = {
            email : user.email,
            token : token1,
            username : user.username,
        }
        res.json({updatedUser});
    });
})

module.exports = router;


