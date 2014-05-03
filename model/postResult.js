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
function postResult(sessionId, dbList, locationList, time, callback) { //TODO parss dbList and location List
   user = new User();
   stats = new Stats();
   points = new Points();
   user.findUserBySessionId(sessionId, function (err, user2) {
      if (err) {
         callback(new Error(err))
      } else {
         user = user2
         stats.findByUserId(user.Stats_idStats, function (err, stats2) {
            if (err) {
               callback(new Error(err))
            } else {
               stats = stats2
               points.calculate(stats, dbList, locationList, time, function (err, stats) {
                  stats.update(function (err) {
                     if (err) {
                        callback(err)
                     } else {
                        callback(null)
                     }
                  })
               })
            }
         });
      }
   })
}

module.exports = postResult;
