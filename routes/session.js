var db = require('../db');
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var crypto = require('crypto');


/**
* @author Timbo925
* function will login a user with the right username and password
* if successfull returns sessionId in Json format {sessionId: "sessionId"}
*/
exports.login = function (req, res) {
   var userName = req.body.username;
   var password = req.body.password;
   console.log("Password body: " + password + typeof password);
   if (typeof userName != 'undefined' && typeof password != 'undefined') {
      db.getConnection( function(err, connection) {
         if(!err) {
            var sql = "select * from User where userName = ?";
            var inserts = [userName];
            sql = mysql.format(sql, inserts);
            console.log("SQL: " + sql);
            connection.query(sql, function (err , sqlres) {  // Reteiving user from the datbase
               if(!err) {
                  if (sqlres.length == 0) {
                     res.json(500, "User not found")
                  } else {
                     connection.release();
                     console.log("Retreived user: " + sqlres);
                     //res.json(200, sqlres);
                     console.log("Password hash: " + sqlres[0].password)
                     //var salt = bcrypt.genSaltSync(10);
                     //var hash = bcrypt.hashSync(password, salt);
                     console.log("Hashed password: "+ password);
                     if (bcrypt.compareSync(password, sqlres[0].password)) {  // Comparing passwords from request with database
                        newSession(sqlres[0].idUser, function(err, sessionId) { // Generating new sessionId for this user
                           if(!err) {
                              console.log("New session created with key: " + sessionId);
                              //res.cookie('SessionCookie' , sessionId, {maxAge: 9000000, httpOnly: true});
                              res.json(200, {sessionId: sessionId });
                           } else {
                              res.json(500, "Problem creating session")
                           }
                        })
                     } else {
                        res.json(500, "Wrong password");
                     }
                  }
               }
            })
         }
         if(err) {
            res.json(500, err);
            connection.release();
         }
      })
   } else {
      res.json(500, "Required param not included: username, password")
   }
}

/**
* @author Timbo925
* removes sessionId out of the database
*/
exports.logout = function (req, res) {
   var sessionId = req.params.session;
   console.log("SessionId logout: " + sessionId);
   if (sessionId) {
      db.getConnection(function (err, connection){
         if(!err) {
            var sql = "delete from Session where idSession = ?";
            var inserts = [sessionId];
            sql = mysql.format(sql, inserts);
            connection.query (sql, function(err, sqlres) {
               connection.release();
               if(!err) {
                  res.json(200, "User logged out");
               } else {
                  res.json(500, "Something went worng");
               }
            });
         } else {
            res.json(500, "Error connection to the database")
         }
      })
   }
   else {
      res.json(500, "No param session given")
   }
}

/**
* @Timbo925
* Function find session in databsae by sessionId and returns
* corresponding userId.
*/
exports.getIdBySession = function (sessionId, callback) {
   db.getConnection( function(err, connection) {
      if(!err) {
         var sql = "select * from Session where idSession = ?";
         var inserts = [sessionId];
         sql = mysql.format(sql, inserts);
         connection.query(sql, function (err, sqlres) {
            connection.release();
            if(!err) {
               console.log("sqlres")
               if (sqlres.length == 1) {
                  callback(null,sqlres[0].User_idUser);
               } else {
                  callback(new Error("Key doens't exist in the database"));
               }
            }
         })
      } else {
         callback(new Error("Database connection problem"));
      }
   })
}

/**
* Code generator for random keysting
* by freakish @ stackoverflow.com
*/
var generate_key = function() {
   var sha = crypto.createHash('sha256');
   sha.update(Math.random().toString());
   return sha.digest('hex');
};

/**
* @author Timbo925
* Function creating a new session in the database.
* Success: callback(null, sessionId)
*/
var newSession = function (id, callback) {
   db.getConnection( function(err, connection) {
      var sessionId = generate_key();

      var sql = "insert into Session (idSession, User_idUser) values (?,?)";
      var inserts = [sessionId, id];
      sql = mysql.format(sql, inserts);
      console.log("SQL: " + sql);
      connection.query(sql, function (err) {
         connection.release()
         if(!err) {
            callback(null, sessionId);
         } else {
            console.log(err);
            callback(new Error("Could add new session id to the database"))
         }
      });
   })
}
