/**
* Points will be returnd to the application trough the API to indicate the amount of points given for the measuremnt
*
*/
function Points () {
	this.points = 200;
	this.multi_place = 1;
	this.multi_time = 1;
	this.multi_special = 1;

};

/**
* callback(err, this)
* Based on the statistics will calculate the correct points and will return this object
*
*/
Points.prototype.calculate = function(stats) {
	console.log("BEFORE -- Stats Lvl: " + stats.level + " Stats exp:" + stats.exp)


	base = 100; 			// Base point for each mesurement
	this.post();			// Post the measurments to the NoiseTube server
	this.multi_place = this.calculateMultiPlace();
	this.multi_time = this.calculateMultiTime();

	basePoints = Math.round(base * Math.exp(stats.level/(base-(0.8*base))));
	basePoints = basePoints * this.multi_place * this.multi_time //Amount of point earned
	console.log("Points Calculated: " + basePoints)

	stats.exp += basePoints

	this.levelUp(stats, this)

	console.log("AFTER -- Stats Lvl: " + stats.level + " Stats exp:" + stats.exp)
	return stats
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

Points.prototype.calculateMultiPlace = function (locationList) {
	return this.multi_place*2;
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
