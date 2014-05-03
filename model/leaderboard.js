var mysql = require('mysql');
var db = require('../db')
var session = require('../routes/session')
var User = require('../model/user')
var Stats = require('../model/stats')
var Points = require('../model/points')

function leaderboard() {

}

leaderboard.prototype.get = function get(sessionId, type, callback) { //TODO parss dbList and location List
   var lb = this;
   stats = new Stats();
   points = new Points();
   user = new User();
   user.findUserBySessionId(sessionId, function (err, user) {
      if (err) {
         callback(new Error(err))
      } else {
         //User retreived
         lb.find(user, type, function (err, leaderboard) {
            if (err) {
               callback(new Error(err))
            } else {
               callback(null, leaderboard);
            }
         })
      }
   })
}

leaderboard.prototype.find = function find(user, type, callback) {
   var spread = 5 // How many users scores are shared around the user itselve

   db.getConnection( function (err, connection) {
      if (err) {
         connection.release();
         callback(new Error(err))
      } else {
         order = "DESC"
         // if (type == "amountMeasurments") { //Depending on the type the ordering of the query needs to be changed
         //    order = "ASC"
         // } else {
         //    order = "DESC"
         // }
         var sql = "SELECT @rank:= 0; SELECT @myrank := (SELECT rank FROM (SELECT d.* FROM (SELECT @rank:= @rank + 1 as rank , s.* FROM (SELECT * FROM Stats s ORDER BY ?? " + order
         +  ") s) d) f WHERE idStats = ?); SELECT @rank2:= 0; SELECT g.*, u.userName FROM (SELECT f.* FROM (SELECT d.* FROM (SELECT @rank2:= @rank2 + 1 as rank , s.* FROM (SELECT * FROM Stats s ORDER BY ?? " + order
         +  ") s) d) f WHERE rank BETWEEN IF(@myrank < ?, 0, @myrank - ? )  AND IF(@myrank < ?, ?, @myrank + ? )) g INNER JOIN `User` u ON g.`idStats` = u.`Stats_idStats`  ;"
         var inserts = [type ,user.Stats_idStats, type,spread, spread, spread ,spread*2, spread ]
         sql = mysql.format(sql,inserts)
         console.log("SQL: " + sql)
         connection.query(sql, function (err, sqlres) {
            connection.release()
            if (err) {
               console.log("FAIL LEADERBAORD:" + err)
               callback(new Error(err))
            } else {
               //TODO load sqlres
               console.log("SUCCESS LEADERBAORD")
               callback(null, sqlres[3])
            }
         })
      }
   })
}

module.exports = leaderboard;
