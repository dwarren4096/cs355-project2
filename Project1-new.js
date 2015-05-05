// Module dependencies

var express	= require('express'),
    mysql	= require('mysql'),
    cxn		= require('./connection.js'),
    games	= require('./games.js'),
    dlc		= require('./dlc.js'),
    users	= require('./users.js');

// Application initialization

var app = express();
app.use(express.bodyParser());

// NB req.query is stuff that comes in from URLs. req.body is stuff that comes from forms
// Main page with links to view tables
app.get('/', function(req, res) {
	var responseHTML = cxn.HTMLHeader + '<p><a href="/games">Games</a></p>\n' +
		'<p><a href="/users">Users</a></p>\n' +
		'<p><a href="/devs">Developers</a></p>\n';
	responseHTML += cxn.HTMLFooter;
	res.send(responseHTML);
});

/*********
 * Games *
 *********/

//Lists all games
app.get('/games', function(req, res){
	games.index(req, res);
});

//Lists info for a specific game
app.get('/games/view', function(req, res) {
	games.view(req, res);
});

// Form for adding a new game
app.get('/games/add', function (req, res) {
	games.add(req, res);
});

// Inserts the data from the add form into the database. 
// Also presents a form for adding DLC to the newly entered game.
app.post('/games/insert', function(req, res) {
	games.insert(req, res);
});

// Edit game data
app.get('/games/edit', function(req, res) {
	games.edit(req, res);
});
// Submit updated game data
app.post('/games/update', function(req, res) {
	games.update(req, res);
});

app.get('/games/delete', function(req, res) {
	games.del(req, res);
});


/*******
 * DLC *
 *******/

// Form for adding new DLC to a game
app.get('/dlc/add', function(req, res) {
	dlc.add(req, res);
});
app.post('/dlc/insert', function(req, res) {
	dlc.insert(req, res);
});

// Form for editing DLC info
app.get('/dlc/edit', function(req, res) {
	dlc.edit(req, res);
});
app.post('/dlc/update', function(req, res) {
	dlc.update(req, res);
});

app.get('/dlc/delete', function(req, res) {
	dlc.del(req, res);
});


/*********
 * Users *
 *********/

app.get('/users', function(req, res) {
	users.index(req, res);
});



/********
 * Devs *
 ********/

app.get('/devs', function(req, res) {
	res.send('Coming soon...');
});


// Begin listening

app.listen(8002);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
