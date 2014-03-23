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

exports.create = function (req, res) {
  db.getConnection(function(err, connection) {
    if(!err) {
      var username = req.body.username;
      var password = req.body.password;
      var email = req.body.email;
      if (username && password && email) {
        console.log("Creating account with: " + JSON.stringify(req.body));

        //Checking if user exist in the database
        free(username,email, function(err) {
          if(!err) {
            //Creating user in the database
          } else {
            console.log("User already exists");
            res.status(500);
          }
        })
        res.json(req.body);
      } else {
        console.log("One of the body fields not used" + JSON.stringify(req.body));
        res.status(500);
        res.json(req.body);
      }
    } else {
      console.log("Connection error with the database");
    }
  })
}

free = function (username, email, callback) {
  db.getConnection(function(err, connection) {
    if (!err) {
      connection.query('select * from User where userName = ? or email = ?', [connection.escape(username), connection.escape(email)], function(err, res) { //connection.escape protects agains mysql injection in all user field
        if (!err) {
          if (res == null) { //User does't exist in the database so account can be made
            callback(null);
          } else {
            callback(new Error("User already exists in the database")); //returns an error to the callback function
          }
        } else {
          console.log("Error in db lookup in function 'free' inside user.js")
        }
      })
    } else {
      console.log("Conection error with the databse");
    }
  })
}
