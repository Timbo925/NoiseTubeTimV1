var express = require('express')
, http = require('http')
, mysql = require('mysql')
, path = require('path')
, routes = require('./routes')
, user = require('./routes/user')
, session = require('./routes/session')
, result = require('./routes/result.js')
, leaderboard = require('./routes/leaderboard.js')
, test = require('./routes/test')
, poi = require('./routes/poi');

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

app.get('/', test.multi); // Testing call response

app.post("/user/create" , user.create); // Creating a new user with all needed information
app.get('/user/:session' , user.getUser); // Retreving user from the database based on id. session id needs to be included

app.get('/stats/:session', user.getUserStats) // Retreving user stas from the db corresponding to the session id

app.post('/login' , session.login); // Returns session id when login is sucessfull
app.get('/logout/:session' , session.logout); // Removes all session id's from user out of the database

app.post('/result/:session/:second', result.new) // Posting new results to the server, returns updated stats/points earned and pottential badges

app.get('/leaderboard/:session/:type', leaderboard.getType) //Retreives leaderboard based on user. type options {level, amountMeasurements, totalTime, maxExp}

app.get('/poi/:lat/:lon/:r', poi.getList) // Retieves list of all poit of intrests in radius

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
