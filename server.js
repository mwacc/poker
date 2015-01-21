//	Customization
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

// Librairies

var express = require('express'), app = express();
var bodyParser = require('body-parser');
var crypto =  require('crypto');


var http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);


var jade = require('jade');
// var io = require('socket.io').listen(app);
var pseudoArray = ['admin']; //block the admin username (you can disable it)

// Views Options

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set("view options", { layout: false })

app.use(express.static(__dirname + '/public'));
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));

var LRU = require("lru-cache")
  , options = { max: 5000
              , length: function (n) { return n * 2 }
              , maxAge: 1000 * 60 * 60 * 4 } // 4 hrs per session
  , sessionMap = LRU(options)

// Render and send the main page
app.get('/', function(req, res){
  res.render('home.jade');
});
app.post('/session', function(req, res){
	var shasum = crypto.createHash('sha1');
	shasum.update(req.body.user + Date.now());
	var targetUrl = '/session/' + shasum.digest('hex');
	// 307 Temporary Redirect (since HTTP/1.1) In this occasion, the request should be repeated with another URI
	res.redirect(307, targetUrl);
});
// this is redirected post from /session
app.post('/session/:sessionid', function(req, res) {
	var targetUrl = req.headers.host + '/session/' + req.params.sessionid;
	sessionMap.set(req.params.sessionid, {})
	res.render('session.jade', {session: req.params.sessionid, targetUrl : targetUrl, page_owner_name: req.body.user});
});
// this is shared link that all team members join
app.get('/session/:sessionid', function(req, res) {
	res.render('session.jade', {session: req.params.sessionid, askForName: true});
});

server.listen(server_port, server_ip_address);
// app.listen(appPort);
console.log("Server listening on port "+server_port);

// Handle the socket.io connections
io.sockets.on('connection', function (socket) { // First connection
	
	console.log('...');

	socket.on('connect', function (data) {
		console.log(data);
		var sessionId = data['sessionId'];
		var name = data['name'];
		console.log('user '+name+' joined session '+sessionId);

		io.emit('connect', name);
	});

	
});

