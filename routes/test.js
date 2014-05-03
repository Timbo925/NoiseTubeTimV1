var db = require('../db');
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var session = require('./session');
var user = require('../model/user');

/*
* @author Timbo925
* return json object of the corresponding user with the sessionId
*/
exports.multi = function(req, res) {
   db.getConnectionSingle(function (err, connection) {
      if (err) {
         res.json(500, err)
      } else {
         var sql = 'select 1; select 2;'
         var inserts = []
         sql = mysql.format(sql, inserts)
         connection.query(sql, function (err, sqlres) {
            if (err) {
               res.json(500,err)
            } else {
               res.json(200,sqlres)
            }
         })
      }
   })
}
