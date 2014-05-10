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
Points.prototype.calculate = function(stats, req, callback) {
	var point = this;
	console.log("BEFORE -- Stats Lvl: " + stats.level + " Stats exp:" + stats.exp)
	console.log("Request Post: " + req.body.pointMeasurement)

	var pointMeasurement = req.body.pointMeasurement;
	console.log(pointMeasurement)
	console.log(stats)
	//var baseSecond = req.params.second;

	point.post();			// Post the measurments to the NoiseTube server

	//totalPoints = req.body.dbList.length/baseSecond      //Our basis is based on 1 point each second
	totalPoints = pointMeasurement.totalPoints;
	point.multi_place = pointMeasurement.locationMultiplier;

	// if (req.body.bonuspoints != null) {
	// 	for (var i=0; i<req.body.bonuspoints.length; i++) {  //Adding points for good measurements
	// 		totalPoints += req.body.bonuspoints[i]
	// 		console.log("Add Bonus ctr: " + i)
	// 	}
	// }

	point.points = totalPoints;

	// if(req.body.multiplication != null) {
	// 	for (i=0; i<req.body.multiplication.length; i++) {
	// 		console.log("Add Multi ctr: " + i)
	// 		point.multi_place += req.body.multiplication[i]
	// 	}
	// }

	stats.exp += totalPoints;
	stats.amountMeasurments++;

	point.levelUp(stats, point);  //Set level apropiate with new exp

	console.log("AFTER -- Stats Lvl: " + stats.level + " Stats exp:" + stats.exp + " Total Points: " + totalPoints + " Multi: " + point.multi_place)
	console.log("Points: " + point)
	callback(null, stats) //Return new stats so they can be saved
};

Points.prototype.levelUp = function(stats, pointObj) {
	nextLvl = pointObj.calculatePointNextLevel(stats.level);
	if (stats.exp > nextLvl) {
		stats.nextLevel = nextLvl;
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
	expLvl = 0.11;  //Deciding factor for rising of the hardness level
	baseLvl = 100;  //Deciding the base level of level difference

	var pointsNeeded = 0;
	for (var i=1;i<lvl+1;i++) {
		pointsNeeded += baseLvl*Math.exp(lvl*expLvl);
	}

	return Math.round(pointsNeeded);
}

module.exports = Points;
