var mysql = require('mysql');
var db = require('../db')

//Constructor
function Stats() {

   this.idStats = 0;
   this.exp = 0;
   this.level = 0;
   this.amountMeasurments = 0;
   this.totalTime = 0;
   this.nextLevel = 0;
   this.lastLevel = 0;
   this.maxExp = 0;


}

Stats.prototype.findByUserId = function (idStats, callback) {
   var stats = this;
   db.getConnection( function (err, connection) {
      if (err) {
         conncection.release();
         callback(new Error(err));
      } else {
         var sql = "SELECT * FROM Stats WHERE idStats = ?"
         var inserts = [idStats]
         sql = mysql.format(sql,inserts)
         console.log("SQL: " + sql)
         connection.query(sql, function (err, sqlres) {
            connection.release()
            if (err) {
               callback(new Error(err))
            } else {
               sqlres = sqlres[0]
               stats.idStats = sqlres.idStats;
               stats.exp = sqlres.exp;
               stats.level = sqlres.level;
               stats.amountMeasurments = sqlres.amountMeasurments;
               stats.totalTime = sqlres.totalTime;
               stats.maxExp = sqlres.maxExp
               stats.nextLevel = stats.calculatePointNextLevel(stats.level)
               stats.lastLevel = stats.calculatePointNextLevel(stats.level-1)
               callback(null , stats)
            }
         })
      }
   })
}

Stats.prototype.calculatePointNextLevel = function(lvl) {
   expLvl = 0.11;  //Deciding factor for rising of the hardness level
   baseLvl = 100;  //Deciding the base level of level difference

   var pointsNeeded = 0;
   for (var i=1;i<lvl+1;i++) {
      pointsNeeded += baseLvl*Math.exp(lvl*expLvl);
   }

   return Math.round(pointsNeeded);
}

Stats.prototype.update = function (callback) {
   var stats = this;
   db.getConnection( function (err, connection) {
      if (err) {
         connection.release();
         callback(new Error(err))
      } else {
         var sql = "UPDATE Stats SET  exp = ?, level = ?, amountMeasurments = ?, totalTime = ?, maxExp = ? WHERE idStats = ?"
         var inserts = [stats.exp, stats.level, stats.amountMeasurments, stats.totalTime, stats.maxExp ,stats.idStats]
         sql = mysql.format(sql,inserts)
         console.log("SQL: " + sql)
         connection.query(sql, function (err, sqlres) {
            connection.release()
            if (err) {
               callback(new Error(err))
            } else {
               callback(null)
            }
         })
      }
   })
}


//Export the class
module.exports = Stats;
