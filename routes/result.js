var postResult = require('../model/postResult')

exports.new = function (req, res) {

   console.log("Request: " + req)
   console.log(postResult)
   postResult.e1(req, function (err) {
      if (err) {
         res.json (500, err)
      } else {
         //Object is fully initialized with user and stats
         output = this;

         res.json (200, {"stats" : this.stats, "points" : this.points})
      }
   });
}

exports.add = function (req, res) {
   console.log("Request: " + req)
   postResult.e2(req, function (err) {
      if (err) {
         res.json (500, err)
      } else {
         output = this;
         res.json (200, {"stats" : this.stats})
      }
   });
}
