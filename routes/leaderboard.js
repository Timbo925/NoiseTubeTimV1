var leaderboard = require('../model/leaderboard')

exports.getType = function (req, res) {
   var sessionId = req.params.session;
   var type = req.params.type;
   lb = new leaderboard();
   lb.get(sessionId, type, function(err, list) {
      (err) ? res.json(500, err) : res.json(200, list)
   })
}
