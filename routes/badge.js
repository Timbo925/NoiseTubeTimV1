var badge = require('../model/badge')

exports.getAll = function(req, res) {
   badge.getAllBadges(function(err,badges) {
      if (err) {
         res.json(500, err);
      } else {
         res.json(200, badges);
      }
   })
}

exports.getBadgesUser = function(req, res) {
   console.log(req.params.session)
   badge.getBadgesUser(req.params.session , function(err,badges) {
      if (err) {
         res.json(500, err);
      } else {
         res.json(200, badges);
      }
   })
}

exports.addBadge = function(req, res) {
   badge.addBadge(req.params.session, req.params.id ,function(err,badges) {
      if (err) {
         res.json(500, err);
      } else {
         res.json(200, badges);
      }
   })
}
