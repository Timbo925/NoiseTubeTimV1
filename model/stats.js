
//Constructor
function Stats(exp, lvl, amount, time) {

   this.exp = exp;
   this.lvl = lvl;
   this.amount = amount;
   this.time = time;

   this.base = 100; //Base point for each mesurement
   this.expMulti = 400;
   this.expLvlDevider = 0.11;
}

Stats.prototype.calculatePoints = function(timeEntry, lat, lng) {
      var points = Math.round(base * Math.exp(lvl/(base-(0.8*base))));  // calculation for effective point counting lvl. No multipliers used
      var multiTime = 1+((Math.round(timeEntry/6))/100)                 // 0.01 multiplier for every 10 second.
      if (multiTime > 2) {                                              // Maximum multiplier of 2
         multiTime = 2;
      }
      var multiPlace  = 1;                                             // TODO multipier based on good location. This can be used for 'events' to organize measuring
      // better and boos community feeling

      points = points * multiPlace * multiTime;
      points = Math.round(points);
      console.log("Adding points:" + points);
      return points;
   }

   Stats.prototype.addPoints = function(points) {
      var pointsNeeded = 0;

      for (var i=0;i<lvl+1;i++) {
         pointsNeeded = pointsNeeded + expMulti*Math.exp(lvl*expLvlDevider);
      }
      exp = exp + points;
      this.exp = exp;                     // Update new exp points
      amount = amount + 1;
      this.amount = amount;              // Adding new measurment amount
      console.log("Amount: " + amount);
      console.log("New exp: " + exp);
      if (exp > pointsNeeded) {
         lvl = lvl + 1;
         this.lvl = lvl;                 // Leveling up because over the next limit
         return true;
      } else {
         return false;
      }
   }
}

//Class Method
Stats.prototype.newEntry = function(timeEntry, lat, lng) {
   this.addPoints(this.calculatePoints(timeEntry, lat, lng));
}

//Export the class
module.exports = Stats;
