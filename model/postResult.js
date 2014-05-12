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
exports.e1 = function postResult(req, callback) {
   user = new User();
   stats = new Stats();
   points = new Points();
   user.findUserBySessionId(req.params.session, function (err, user2) {
      if (err) {
         callback(new Error(err))
      } else {
         user = user2
         stats.findByUserId(user.Stats_idStats, function (err, stats2) {
            if (err) {
               callback(new Error(err))
            } else {
               stats = stats2
               points.calculate(stats, req, function (err, stats) {
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



exports.e2 = function addPoints(req, callback) {
   user = new User();
   stats = new Stats();
   points = new Points();
   user.findUserBySessionId(req.params.session, function (err, user2) {
      if (err) {
         callback(new Error(err))
      } else {
         user = user2
         stats.findByUserId(user.Stats_idStats, function (err, stats2) {
            if (err) {
               callback(new Error(err))
            } else {
               stats = stats2
               points.addPoints(stats, req, function (err, stats) {
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
