var mysql = require('mysql');
var db = require('../db')
var session = require('../routes/session')
var User = require('../model/user')
var Stats = require('../model/stats')
var Points = require('../model/points')

/**
* returns callback(err, this)
* If no error then the user object in initialized
**/
function postResult(sessionId, callback) { //TODO parss dbList and location List
   dbList = []; //array list of all the db measurements
   locationList = [] //coresponding loation list for every dbList entry
   time = 0; // Totat time of the session
   user = new User();
   stats = new Stats();
   points = new Points();
   user.findUserBySessionId(sessionId, function (err, user2) {
      if (err) {
         callback(new Error(err))
      } else {
         this.user = user2
         stats.findByUserId(user.Stats_idStats, function (err, stats2) {
            if (err) {
               callback(new Error(err))
            } else {
               this.stats = stats2
               //TODO Calcuating the points to set this function
               points.calculate(stats)
               callback(null)
            }
         });
      }
   })
}

module.exports = postResult;
