var cxn   = require('./connection.js');
var mysql = require('mysql');

module.exports = {
  add: function(req, res) {
    var UserID = parseInt(req.query.UserID);
    //var GameID = parseInt(req.query.GameID);
    var qry = 'SELECT GameID, GameName FROM Games';
    console.log(qry);
    cxn.connection.query(qry, function(err, result) {
      if (err) {cxn.handleError(res, err);}
      else {
        var responseHTML = cxn.HTMLHeader + '<h1>Adding a game to UserID '+UserID+'\'s library</h1>\n\
          <h2>Select a game</h2>\n\
          <form action="/addgame/submit" method="post">\n\
          <input type="hidden" name="UserID" value="'+UserID+'" />\n\
          <select name="GameID">\n';
        for (int i=0; i<result.length; i++) {
          responseHTML+='<option value="'+result[i].GameID+'">'+result[i].GameName+'</option>\n';
        }
        responseHTML+='</select>\n\
          <input type="submit" value="Submit">';
        res.send(responseHTML);
      }
    });
  },
  
  submit: function(req, res) {
    var UserID = parseInt(req.body.UserID);
    var GameID = parseInt(req.body.GameID);
    var qry1 = 'INSERT INTO GameLibrary (UserID, GameID) VALUES('+UserID+', '+GameID+')';
    console.log(qry1);
    cxn.connection.query(qry1, function(err, result) {
      if (err) {cxn.handleError(res, err);}
      else {
        var responseHTML = cxn.HTMLHeader + '<p><a href="/games/view?GameID='+GameID+'">GameID '+GameID+'</a> \
          has been added to <a href="/users/view?UserID='+UserID+'">UserID '+UserID+'\'s library.</p>\n\
          <p><a href="/addgame/add?UserID='+UserID+'">Add another game</a></p>\n'+
          cxn.HTMLFooter;
        res.send(responseHTML);
      }
    });
  },
  
  del: function(req, res) {
    var UserID = parseInt(req.query.UserID);
    var GameID = parseInt(req.query.GameID);
    var qry1 = 'DELETE FROM Friends_List WHERE (UserID='+UserID+' AND GameID='+GameID+')';
    console.log(qry1);
    cxn.connection.query(qry1, function(err, result) {
      if (err) {cxn.handleError(res, err);}
      else {
        var responseHTML = cxn.HTMLHeader + '<p><a href="/users/view?UserID='+UserID+'">UserID '+UserID+'</a> \
          and <a href="/users/view?UserID='+FriendID+'">UserID '+FriendID+' are no longer friends.</p>\n\
          <p><a href="/users/view?UserID='+UserID+'">Back</a></p>\n'+
          cxn.HTMLFooter;
        res.send(responseHTML);
      }
    });
  }
}
