var db = require('../db');

/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.displayAll = function (req,res) {
    db.getConnection(function(err, connection) {
        if (!err) {
             connection.query('select * from userTest', function (err, docs) {
                 res.render('users' , {users: docs});
            });
        } else {
            console.log("Connection error with the database");
        }
    }); 
}

exports.insert = function (req, res) {
    db.getConnection(function(err, connection) {
        if (!err) {
            var fname=req.body.fname;
            var lname=req.body.lname;
            connection.query('INSERT INTO userTest (fname, lname) VALUES (? , ?);' , [fname, lname], function(err, docs) {
                if (err) res.json(err);
                res.redirect('users');
            });
        } else {
            console.log("Connection error with the database");
        }
    }); 
}
