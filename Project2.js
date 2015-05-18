// Module dependencies
var express = require('express'),
    mysql = require('mysql'),
    bodyParser = require('body-parser'),
    cxn = require('./connection.js'),
    games = require('./games.js'),
    dlc = require('./dlc.js'),
    users = require('./users.js'),
    friendreq = require('./friendreq.js'),
    addgame = require('./addgame.js'),
    devs = require('./devs.js');

// Application initialization
var app = express();
app.use(bodyParser.urlencoded({extended: true}));

// NB req.query is stuff that comes in from URLs. req.body is stuff that comes from forms
// Main page is store front, same as /games
app.get('/', function(req, res) {
  games.index(req, res);
  /*var responseHTML = cxn.HTMLHeader + '<h1>Vapor Game Distribution</h1>\n'+
    '<p><a href="/games">Games</a></p>\n' +
    '<p><a href="/users">Users</a></p>\n' +
    '<p><a href="/devs">Developers</a></p>\n';
  responseHTML += cxn.HTMLFooter;
  res.send(responseHTML);*/
});
app.get('/project2.css', function (req, res) {
  res.sendFile('/project2.css');
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

app.get('/users/view', function(req, res) {
  users.view(req, res);
});

app.get('/users/add', function(req, res) {
  users.add(req, res);
});
app.post('/users/insert', function(req, res) {
  users.insert(req, res);
});

app.get('/users/edit', function(req, res) {
  users.edit(req, res);
});
app.post('/users/update', function(req, res) {
  users.update(req, res);
});

//update status
app.get('/users/status/edit', function(req, res) {
  users.status_edit(req, res);
});
app.post('/users/status/update', function(req, res) {
  users.status_update(req, res);
});

app.get('/users/delete', function(req, res) {
  users.del(req, res);
});

//add and remove friends
app.get('/friendreq/add', function(req, res) {
  friendreq.add(req, res);
});
app.post('/friendreq/submit', function(req, res) {
  friendreq.submit(req, res);
});

app.get('/friendreq/del', function(req, res) {
  friendreq.del(req, res);
});

//add and remove games from a user's library
app.get('/addgame/add', function(req, res) {
  addgame.add(req, res);
});
app.post('/addgame/submit', function(req, res) {
  addgame.submit(req, res);
});

app.get('/addgame/del', function(req, res) {
  addgame.del(req, res);
});

/********
 * Devs *
 ********/

app.get('/devs', function(req, res) {
  devs.index(req, res);
});

app.get('/devs/view', function(req, res) {
  devs.view(req, res);
});

app.get('/devs/add', function(req, res) {
  devs.add(req, res);
});
app.post('/devs/insert', function(req, res) {
  devs.insert(req, res);
});

app.get('/devs/edit', function(req, res) {
  devs.edit(req, res);
});
app.post('/devs/update', function(req, res) {
  devs.update(req, res);
});

app.get('/devs/delete', function(req, res) {
  devs.del(req, res);
});

app.get('/about', function(req, res) {
  res.send('about page coming soon');
});


// Begin listening
var port = 8002;
app.listen(port);
console.log("Express server listening on port %d", port);
