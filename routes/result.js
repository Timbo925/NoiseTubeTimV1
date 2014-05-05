var postResult = require('../model/postResult')

exports.new = function (req, res) {
   var sessionId = req.params.session;
   var dbList = req.body.dbList
   var locationList = req.body.locationList
   var time = req.body.time
   //var bonuspoints = req.body.bonuspoints
   //var multiplicationPoi = req.body.multiplicationPoi
   //var second = req.params.second

   console.log("Request: " + req)
   postResult(req, function (err) {
      if (err) {
         res.json (500, err)
      } else {
         //Object is fully initialized with user and stats
         array = []
         array.push(this.user)
         array.push(this.stats)
         array.push(this.points)
         res.json (200, array)
      }
   });
}
