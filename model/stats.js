var mysql = require('mysql');
var db = require('../db')

//Constructor
function Stats(exp, lvl, amount, time) {

   this.idStats = 0;
   this.exp = 0;
   this.level = 0;
   this.amountMeasurments = 0;
   this.totalTime = 0;


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
            if (err) {
               callback(new Error(err))
            } else {
               sqlres = sqlres[0]
               stats.idStats = sqlres.idStats;
               stats.exp = sqlres.exp;
               stats.level = sqlres.level;
               stats.amountMeasurments = sqlres.amountMeasurments;
               stats.totalTime = sqlres.totalTime;
               callback(null , stats)
            }
         })
      }
   })
}
/*
for (var i=0;i<lvl+1;i++) {
   pointsNeeded = pointsNeeded + expMulti*Math.exp(lvl*expLvlDevider);
}

this.base = 100; //Base point for each mesurement
this.expMulti = 400;
this.expLvlDevider = 0.11;

var points = Math.round(base * Math.exp(lvl/(base-(0.8*base))));  // calculation for effective point counting lvl. No multipliers used

*/


//Export the class
module.exports = Stats;
