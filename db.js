var mysql = require('mysql')
var pool = mysql.createPool({
    host : '127.0.0.1',
    user : 'root',
    password : 'warcraft',
    database : 'NoiseTubeTim'
    });

exports.getConnection  = function (callback) {
    pool.getConnection(function (err, connection) {
        callback(err, connection);
    });
};