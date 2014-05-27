var db = require('../db');
var mysql = require('mysql');
var User = require('../model/user')

exports.getAllBadges = function (callback) {
   db.getConnection( function( err, connection) {
      if (err) {
         connection.release();
         callback(new Error(err))
      } else {
         var sql = "SELECT * From Badge"
         connection.query(sql, function (err, sqlres) {
            connection.release();
            if (err) {
               callback(new Error(err)) ;
            } else {
               console.log("Dages List: " + sqlres) ;
               if (sqlres.length == 0) {
                  callback(new Error("No results found"))
               } else {
                  callback(null,sqlres);
               }
            }
         })
      }
   })
}

exports.getBadgesUser = function (sessionId ,callback) {
   db.getConnection( function(err, connection) {
      if (err) {
         connection.release();
         callback(new Error(err))
      } else {
         user = new User();
         user.findUserBySessionId(sessionId, function (err, user) {
            if (err) {
               connection.release();
               callback(new Error(err))
            } else {
               console.log("Reteived user: " + user)
               var sql = "SELECT * FROM Badge INNER JOIN (SELECT * FROM User_has_Badge WHERE User_idUser = ?) tb ON tb.Badge_idBadge = Badge.idBadge"
               var inserts = [user.idUser]
               sql = mysql.format(sql,inserts)
               console.log("SQL: " + sql)
               connection.query(sql, function (err ,sqlres) {
                  connection.release();
                  if (err) {
                     callback(new Error(err));
                  } else {
                     var list = [];
                     for (var i = 0; i < sqlres.length; i++) {
                        list.push(sqlres[i].idBadge)
                     }
                     callback(null, {"badges" : list});
                  }
               })
            }
         })
      }
   })
}


exports.addBadge = function (sessionId, id ,callback) {
   db.getConnection( function(err, connection) {
      if (err) {
         connection.release();
         callback(new Error(err))
      } else {
         user = new User();
         user.findUserBySessionId(sessionId, function (err, user) {
            if (err) {
               connection.release();
               callback(new Error(err))
            } else {
               var sql = "SELECT * FROM Badge WHERE idBadge = ?"
               var inserts = [id]
               sql = mysql.format(sql,inserts)
               console.log("SQL: " + sql)
               connection.query(sql, function(err, sqlbadge) {
                  var badge = sqlbadge[0]
                  if (err) {
                     connection.release();
                     callback(new Error(err))
                  } else if (sqlbadge.length = 0) {
                     connection.release();
                     callback(new Error("No badge found with id" + id))
                  } else {
                     sql = "INSERT INTO User_has_Badge VALUES (?,?)";
                     inserts = [user.idUser, id];
                     sql = mysql.format(sql,inserts);
                     console.log("SQL: " + sql);
                     connection.query(sql, function(err, sqlres) {
                        connection.release();
                        if (err) {
                           callback(new Error(err));
                        } else {
                           callback(null, badge);
                        }
                     })
                  }
               })

            }
         })
      }
   })
}
