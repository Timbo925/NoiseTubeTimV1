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
  u.findUserBySessionId(sessionId,res);
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



/**
* @ author Timbo925
* Function that will lookup username and email in the database.
* Fail: callback(error)
* Success: callback(null)
*/
free = function (username, email, callback) {
  db.getConnection(function(err, connection) {
    if (!err) {
      var sql = "select * from ?? where ?? = ? or 'email' = ?"; // ? values are protected with connection.escape() to avoid sql injections
      var inserts = ['User', 'userName', username, email];
      sql = mysql.format(sql,inserts);
      console.log("sql querry: " + sql)
      connection.query(sql, function(err, res) { //connection.escape protects agains mysql injection in all user field
        console.log("Results form db function free: " + res.length);
        connection.release();
        if (!err) {
          if (res.length == 0) { //User does't exist in the database so account can be made
            callback(null);
          } else {
            callback(new Error("User already exists in the database")); //returns an error to the callback function
          }
        } else {
          console.log("Error in db lookup in function 'free' inside user.js");
          callback(new Error("Error in db lookup in function free inside user.js"));
        }
      })
    } else {
      console.log("Conection error with the databse");
      callback(new Error("Connection with database problem"));
    }
  })
}
