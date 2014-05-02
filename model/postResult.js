var mysql = require('mysql');
var db = require('../db')
var session = require('../routes/session')
var User = require('../model/user')
var Stats = require('../model/stats')

/**
* returns callback(err, this)
* If no error then the user object in initialized
**/
function postResult(sessionId, callback) {
   dbList = []; //array list of all the db measurements
   locationList = [] //coresponding
   time = 0;
   user = new User();
   stats = new Stats();
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
               callback(null)
            }
         });
      }
   })
}

module.exports = postResult;
