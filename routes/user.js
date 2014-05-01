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
   u.findUserBySessionId(sessionId, function (err, result) {
      if(!err) {
         console.log(result)
         res.json(200,result);
      } else {
         res.json(500,err)
      }
   })
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
