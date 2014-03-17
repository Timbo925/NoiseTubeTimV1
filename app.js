var express = require('express')
, http = require('http')
, mysql = require('mysql')
, path = require('path')
, routes = require('./routes')
, user = require('./routes/user');

var app = express();
// all environments
app.set('port', process.env.PORT || 3002);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function( req, res) {
    res.render('index');
});

app.get('/users', user.displayAll); // Getting all users from the database

// Add a new User
app.get("/users/new", function (req, res) {res.render("new");});

// Save the Newly created User
app.post("/users", user.insert);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});