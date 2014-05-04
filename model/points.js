var mysql = require('mysql');
var db = require('../db')
var poi = require('../model/poi')
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
	poi.getPoiList(locationList[0][0], locationList[0][1], function(err, PoiList) {
		if (err) {
			callback(new Error(err))
		} else {
			callback(null, PoiList[0])
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
