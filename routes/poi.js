var poi = require('../model/poi')

exports.getList = function (req, res) {
   var lon = req.params.lon
   var lat = req.params.lat
   var r = req.params.r
   if (lat == null || lon == null || r == null) { //Catches both null and undefined
      res.json(500, "need url of the format: /latitude/longitude/radius")
   } else {
      poi.getPoiListradius(lat, lon, r, function (err, list) {
         if (err) {
            res.json(500, new Error(err))
         } else {
            res.json(200, list)
         }
      })
   }
}
