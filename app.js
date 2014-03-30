var express = require('express')
, http = require('http')
, mysql = require('mysql')
, path = require('path')
, routes = require('./routes')
, user = require('./routes/user')
, session = require('./routes/session');

var app = express();
// all environments
app.set('port', process.env.PORT || 3002);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function( req, res) { res.render("<h1> NoiseTubeApiV01 API</h1>");}); // Testing call response

app.post("/user" , user.create); // Creating a new user with all needed information
app.get('/user/:session' , user.getUser); // Retreving user from the database based on id. session id needs to be included

app.post('/login' , session.login); // Returns session id when login is sucessfull
app.get('/logout/:session' , session.logout); // Removes all session id's from user out of the database



http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
