var db = require('../db');
var mysql = require('mysql');

exports.getPoiList = function (lat,lon,callback) {
   db.getConnection( function (err, connection) {
      if (err) {
         conncection.release();
         callback(null, 1)
      } else {
         var sql = "SELECT idPoi, name, position, description, bonusPoints, bonusMulti, radius, type ,units * DEGREES( ACOS(COS(RADIANS(latpoint))* COS(RADIANS(X(`position`)))* COS(RADIANS(longpoint) - RADIANS(Y(`position`)))+ SIN(RADIANS(latpoint))* SIN(RADIANS(X(`position`))))) AS distance FROM Poi JOIN ( SELECT ?  AS latpoint, ?  AS longpoint,  111.054 AS units) AS p ON (1=1) WHERE MbrIntersects(GeomFromText ( CONCAT('LINESTRING(',latpoint-(radius/units),' ',	longpoint-(radius/(units* COS(RADIANS(latpoint)))),',',latpoint+(radius/units) ,' ',longpoint+(radius /(units * COS(RADIANS(latpoint)))),')')),  `position`)";
         //var inserts = [50.8637829, 4.418763]
         var inserts = [lat, lon] //Use the start location to calculate the possible bonus
         sql = mysql.format(sql,inserts)
         console.log("SQL: " + sql)
         connection.query(sql, function (err, sqlres) {
            connection.release()
            if (err) {
               callback(new Error(err))
            } else {
               console.log("Location Bonus: " + sqlres[0].bonusMulti)
               console.log("Length: " + sqlres.length )
               if (sqlres.length == 0) {
                  callback(null, null)
               } else {
                  callback(null, sqlres)
               }
            }
         })
      }
   })
}

exports.getPoiListradius = function (lat,lon,r,callback) {
   db.getConnection( function (err, connection) {
      if (err) {
         conncection.release();
         callback(null, 1)
      } else {
         var sql = "SELECT idPoi, name, position, description, bonusPoints, bonusMulti, radius,type ,units * DEGREES( ACOS(COS(RADIANS(latpoint))* COS(RADIANS(X(`position`)))* COS(RADIANS(longpoint) - RADIANS(Y(`position`)))+ SIN(RADIANS(latpoint))* SIN(RADIANS(X(`position`))))) AS distance FROM Poi JOIN ( SELECT ?  AS latpoint, ?  AS longpoint,  111.054 AS units) AS p ON (1=1) WHERE MbrIntersects(GeomFromText ( CONCAT('LINESTRING(',latpoint-( ? /units),' ',	longpoint-( ? /(units* COS(RADIANS(latpoint)))),',',latpoint+( ? /units) ,' ',longpoint+( ? /(units * COS(RADIANS(latpoint)))),')')),  `position`)";
         //var inserts = [50.8637829, 4.418763]
         var inserts = [lat, lon,r,r,r,r] //Use the start location to calculate the possible bonus
         sql = mysql.format(sql,inserts)
         console.log("SQL: " + sql)
         connection.query(sql, function (err, sqlres) {
            connection.release()
            if (err) {
               callback(new Error(err))
            } else {
               if (sqlres.length == 0) {
                  callback(null, null)
               } else {
                  callback(null, sqlres)
               }
            }
         })
      }
   })
}
