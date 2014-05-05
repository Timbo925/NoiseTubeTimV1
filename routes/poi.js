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

            //console.log(list[2].position)
            for (var i = 0; i<list.length; i++) {
               var locList = []
               if (list[i].type == "AREA") {
                  for (var j=0; j<list[i].position[0].length; j++) {
                     locList.push(list[i].position[0][j].x)
                     locList.push(list[i].position[0][j].y)
                  }
               } else {
                  locList.push(list[i].position.x)
                  locList.push(list[i].position.y)
               }
               list[i].position = locList;
               list[i].distance = Math.round(list[i].distance*100) / 100
            }
            res.json(200, list)
         }
      })
   }
}
