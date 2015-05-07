var cxn   = require('./connection.js');
var mysql = require('mysql');

module.exports = {
  add: function(req, res) {
    var UserID = parseInt(req.query.UserID);
    var qry = mysql.format('SELECT UserID, UserName FROM Users WHERE UserID!=?', UserID);
    console.log(qry);
    cxn.connection.query(qry, function(err, result) {
      if (err) {cxn.handleError(res, err);}
      else {
        var responseHTML = cxn.HTMLHeader + '<h1>Select a user</h1>\n\
          <form action="/friendreq/submit" method="post">\n\
          <input type="hidden" name="UserID" value="'+UserID+'" />\n\
          <select name="FriendID">\n';
        for (var i=0; i<result.length; i++) {
          responseHTML+='<option value="'+result[i].UserID+'">'+result[i].UserName+'</option>\n';
        }
        responseHTML+='</select>\n\
          <input type="submit" value="Submit">';
        res.send(responseHTML);
      }
    });
  },
  
  submit: function(req, res) {
    var UserID = parseInt(req.body.UserID);
    var FriendID = parseInt(req.body.FriendID);
    //friend relationship is reciprocal, insert two entries with opposing values
    var qry1 = 'INSERT INTO Friends_List (UserID, FriendID) VALUES('+UserID+', '+FriendID+'), \
      ('+FriendID+', '+UserID+')';
    console.log(qry1);
    cxn.connection.query(qry1, function(err, result) {
      if (err) {cxn.handleError(res, err);}
      else {
        var responseHTML = cxn.HTMLHeader + '<p><a href="/users/view?UserID='+UserID+'">UserID '+UserID+'</a> \
          and <a href="/users/view?UserID='+FriendID+'">UserID '+FriendID+' are now friends.</p>\n\
          <p><a href="/friendreq/add?UserID='+UserID+'">Add another friend</a></p>\n'+
          cxn.HTMLFooter;
        res.send(responseHTML);
      }
    });
  },
  
  del: function(req, res) {
    var UserID = parseInt(req.query.UserID);
    var FriendID = parseInt(req.query.FriendID);
    var qry1 = 'DELETE FROM Friends_List WHERE (UserID='+UserID+' AND FriendID='+FriendID+')\
      OR (UserID='+FriendID+' AND FriendID='+UserID+')';
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
