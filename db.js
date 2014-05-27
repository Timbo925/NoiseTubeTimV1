var mysql = require('mysql')
var pool = mysql.createPool({
    host : '127.0.0.1',
    user : 'root',
    password : 'warcraft',
    database : 'NT2',
    multipleStatements: true,
    debug: false
    });

var con = mysql.createConnection({
   host : '127.0.0.1',
   user : 'root',
   password : 'warcraft',
   database : 'NT2',
   multipleStatements: true,
   debug: false
})

exports.getConnection  = function (callback) {
    pool.getConnection(function (err, connection) {
        callback(err, connection);
    });
};

exports.getConnectionSingle = function (callback) {
    callback(null, con)
};
