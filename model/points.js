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
	nextLvl = this.calculatePointNextLevel(stats.level);

	base = 100; 			// Base point for each mesurement
	this.post();
	this.multi_place = this.calculateMultiPlace();
	this.multi_time = this.calculateMultiTime();

	this.points = Math.round(base * Math.exp(stats.level/(base-(0.8*base))));
	this.points = this.points * this.multi_place * this.multi_time
	console.log("Points Calculated: " + this.points)

};

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

	var pointsNeeded;
	for (var i=0;i<lvl+1;i++) {
		pointsNeeded = pointsNeeded + this.expMulti*Math.exp(lvl*expLvlDevider);
	}
	return pointsNeeded;
}

module.exports = Points;
