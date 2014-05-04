var mysql = require('mysql');
var db = require('../db')

/**
* Points will be returnd to the application trough the API to indicate the amount of points given for the measuremnt
*
*/
function Points () {
	this.points = 100;
	this.multi_place = 1;
	this.multi_time = 1;
	this.multi_special = 1;

};

/**
* callback(err, this)
* Based on the statistics will calculate the correct points and will return this object
*
*/
Points.prototype.calculate = function(stats, dbList, locationList, time, callback) {
	var point = this;
	console.log("BEFORE -- Stats Lvl: " + stats.level + " Stats exp:" + stats.exp)


	base = 100; 			// Base point for each mesurement
	point.post();			// Post the measurments to the NoiseTube server

	point.calculateMultiPlace(locationList, function (err, result) {
		if (err) {
			point.multi_place = 1;
			point.multi_time = point.calculateMultiTime();

			totalPoints = Math.round(base * Math.exp(stats.level/(base-(0.8*base))));
			totalPoints = totalPoints * point.multi_place * point.multi_time //Amount of point earned
			console.log("Points Calculated: " + totalPoints)

			stats.exp += totalPoints
			stats.amountMeasurments++

			point.levelUp(stats, point)

			console.log("AFTER -- Stats Lvl: " + stats.level + " Stats exp:" + stats.exp)
			callback(null, stats)
		} else {
			if (result != null) {
				console.log("PoiResult: " + result)
				point.multi_place += result.bonusMulti;
				base += result.bonusPoints
			}
			point.points = base
			point.multi_time = point.calculateMultiTime();

			totalPoints = Math.round(base * Math.exp(stats.level/(base-(0.8*base))));
			totalPoints = totalPoints * point.multi_place * point.multi_time //Amount of point earned
			console.log("Points Calculated: " + totalPoints)

			stats.exp += totalPoints
			stats.amountMeasurments++

			point.levelUp(stats, point)

			console.log("AFTER -- Stats Lvl: " + stats.level + " Stats exp:" + stats.exp)
			callback(null, stats)
		}
	})
};

Points.prototype.levelUp = function(stats, pointObj) {
	nextLvl = pointObj.calculatePointNextLevel(stats.level);
	console.log("Next Level: " + nextLvl)
	if (stats.exp > nextLvl) {
		stats.level++
		arguments.callee(stats, pointObj)
		return true;
	}
	return false;
}

Points.prototype.post = function(dbList, locationList) {

	console.log("TODO post measuerements to noisetube")
}

Points.prototype.calculateMultiPlace = function (locationList, callback) {
	var point = this;
	db.getConnection( function (err, connection) {
		if (err) {
			conncection.release();
			callback(null, 1)
		} else {
			var sql = "SELECT idPoi, name, position, description, bonusPoints, bonusMulti, radious,units * DEGREES( ACOS(COS(RADIANS(latpoint))* COS(RADIANS(X(`position`)))* COS(RADIANS(longpoint) - RADIANS(Y(`position`)))+ SIN(RADIANS(latpoint))* SIN(RADIANS(X(`position`))))) AS distance FROM Poi JOIN ( SELECT ?  AS latpoint, ?  AS longpoint,  111.054 AS units) AS p ON (1=1) WHERE MbrContains(GeomFromText ( CONCAT('LINESTRING(',latpoint-(radious/units),' ',	longpoint-(radious/(units* COS(RADIANS(latpoint)))),',',latpoint+(radious/units) ,' ',longpoint+(radious /(units * COS(RADIANS(latpoint)))),')')),  `position`)";
			//var inserts = [50.8637829, 4.418763]
			var inserts = [locationList[0][0], locationList[0][1]] //Use the start location to calculate the possible bonus
			sql = mysql.format(sql,inserts)
			console.log("SQL: " + sql)
			connection.query(sql, function (err, sqlres) {
				connection.release()
				if (err) {
					callback(null)
					//callback(new Error(err))
				} else {
					console.log("Location Bonus: " + sqlres[0].bonusMulti)
					console.log("Length: " + sqlres.length )
					if (sqlres.length == 0) {
						callback(null, null)
					} else {
						callback(null, sqlres[0])
					}
				}
			})
		}
	})
}

Points.prototype.calculateMultiTime = function (time) {
	return this.multi_time;
}

Points.prototype.calculatePointNextLevel = function(lvl) {
	expLvlDevider = 0.11;
	expMulti = 400;

	var pointsNeeded = 0;
	for (var i=1;i<lvl+1;i++) {
		pointsNeeded += expMulti*Math.exp(lvl*expLvlDevider);
	}

	return Math.round(pointsNeeded);
}

module.exports = Points;
