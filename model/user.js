var mysql = require('mysql');
var db = require('../db')
var session = require('../routes/session');

function User() {
 this.name = "Testing"
}

User.prototype.findUserBySessionId = function (sessionId, res) {
 db.getConnection( function(err, connection) {
  if (!err) {
   console.log("Request SessionId: "+ sessionId)
         session.getIdBySession(sessionId, function(err, id) { //Checking if user is logged in
            if (!err) { //session id belongs to user
             var sql = "select * from User where idUser = ? ";
             var inserts = [id];
             sql = mysql.format(sql,inserts);
             console.log("SQL: " + sql);
             connection.query(sql, function (err, sqlres) {
              connection.release();
              if (err) {
               res.json(500, "Problem retreiving user from the database");
             } else {
               res.json(200, sqlres[0]);
             }
           })
           }
           else {
             res.json(500, "Wrong sessionId for requested user");
             connection.release();
           }
         })
       } else {
         res.json(500, "Error connecting to the database");
         connection.release();
       }
     })
}

User.prototype.create = function(username, password, email, res) {
 db.getConnection(function(err, connection) {
  if(!err) {
   if (username && password && email) {
    console.log("Creating account with: " + JSON.stringify(req.body));
            //Checking if user exist in the database
            free(username,email, function(err) {
             if(!err) {
                  //Creating user in the database and needed other database entry (stats)
                  var sql = "insert into Stats (exp) value ('1')";
                  console.log("SQL: " + sql);
                  connection.query(sql, function(err, sqlres) {
                   if(!err) {
                    var salt = bcrypt.genSaltSync(10);
                        var hash = bcrypt.hashSync(password, salt);  //Checking password agains hash bcrypt.compareSync("string", hash); // true

                        var sql = "insert into User (userName, email, password, Type, Stats_idStats) values (?,?,?,?,?)";
                        var inserts = [username, email,hash,'User', sqlres.insertId];
                        sql = mysql.format(sql,inserts);
                        console.log("SQL: " + sql);
                        connection.query(sql, function (err, sqlres2) {
                         if (!err) {
                          console.log("User created Sucess");
                          res.json(200);
                          connection.release();
                        } else {
                          var sql = "delete * from Stats where idStats = ?";
                          var inserts = [sqlres.insertId];
                          sql = mysql.format(sql,inserts);
                          connection.query(sql);
                          console.log("SQL: " + sql);
                          res.json(500, {error : 'Problem creating User. Deleted Stats'});
                          connection.release();
                        }
                      })
                      } else {
                        res.json(500, {error : 'Error creating new Stats entry'});
                        connection.release();
                      }
                    })
            } else {
                console.log("Error creating user: " + err);
                res.json(500, { error : 'Error creating user'});
                connection.release();
}
})
} else {
  res.json(500, {error:"One body field not used" , json : JSON.stringify(req.body)});
  connection.release();
}
} else {

 res.json(500, {error:'Database connection problem'});
 connection.release();
}
})
}

/**
* @ author Timbo925
* Function that will lookup username and email in the database.
* Fail: callback(error)
* Success: callback(null)
*/
free = function (username, email, callback) {
  db.getConnection(function(err, connection) {
    if (!err) {
      var sql = "select * from ?? where ?? = ? or 'email' = ?"; // ? values are protected with connection.escape() to avoid sql injections
      var inserts = ['User', 'userName', username, email];
      sql = mysql.format(sql,inserts);
      console.log("sql querry: " + sql)
      connection.query(sql, function(err, res) { //connection.escape protects agains mysql injection in all user field
        console.log("Results form db function free: " + res.length);
        connection.release();
        if (!err) {
          if (res.length == 0) { //User does't exist in the database so account can be made
            callback(null);
        } else {
            callback(new Error("User already exists in the database")); //returns an error to the callback function
          }
        } else {
          console.log("Error in db lookup in function 'free' inside user.js");
          callback(new Error("Error in db lookup in function free inside user.js"));
        }
      })
    } else {
      console.log("Conection error with the databse");
      callback(new Error("Connection with database problem"));
    }
  })
}

module.exports = User;
