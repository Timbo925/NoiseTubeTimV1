var db = require('../db');
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var session = require('./session');
var user = require('../model/user');

/*
* @author Timbo925
* return json object of the corresponding user with the sessionId
*/
exports.getUser = function (req, res) {
   var sessionId = req.params.session;
   var u = new user();
   u.findUserBySessionId(sessionId, function (err, user) {
      if(!err) {
         //console.log(user)
         res.json(200,user);

      } else {
         res.json(500,err)
      }
   })
   console.log("My Username otuside: " + u.userName)
}


/**
* @author Timbo925
* Creating a new user
* Expecting JSON body: username,password,email
*/
exports.create = function (req, res) {
   var u = new user();
   u.create(req.body.username, req.body.password, req.body.email, res);
}
