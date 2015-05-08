var cxn   = require('./connection.js');
var mysql = require('mysql');

module.exports = {
  // List all users
  index: function(req, res) {
    var qry = 'SELECT UserID, UserName, UserEmail, UserStatus FROM Users';
    cxn.connection.query(qry, function(err, result) {
      if (err) {cxn.handleError(res, err);}
      else {
        var responseHTML = cxn.HTMLHeader + '<h1>Users</h1>\n<table border=1>\n<tr>\n\
          <th>UserID</th>\n\
          <th>UserName</th>\n\
          <th>UserEmail</th>\n\
          <th>UserStatus</th>\n</tr>\n';

        for (var i=0; i < result.length; i++) {
          responseHTML += '<tr>\n<td>'+result[i].UserID+'</td>\n\
            <td><a href="/users/view?UserID='+result[i].UserID+'">'+result[i].UserName+'</a></td>\n\
            <td>'+result[i].UserEmail+'</td>\n\
            <td>'+result[i].UserStatus+'</td>\n\
            </tr>\n';
        }
        responseHTML += '</table>\n\
          <p><a href="/users/add">New user signup</a><br />\n\
          <a href="/">Back</a></p>\n' + cxn.HTMLFooter;
        res.send(responseHTML);
      }
    });
  },

  //View detailed info on a user
  view: function(req, res) {
    var UserID = parseInt(req.query.UserID);
    var qry1 = mysql.format('SELECT UserID, UserName, UserEmail, UserStatus FROM Users WHERE UserID=?', UserID);
    console.log(qry1);
    cxn.connection.query(qry1, function(err, result) {
      if (err) {cxn.handleError(res, err);}
      else {
        var UserQryResult = result;

        var qry2 = mysql.format('SELECT Users.UserID, Users.UserName FROM Friends_List '+
          'RIGHT JOIN Users ON Friends_List.FriendID = Users.UserID WHERE Friends_List.UserID=?',
          UserID);
        console.log(qry2);
        cxn.connection.query(qry2, function(err, result) {
          if (err) {cxn.handleError(res, err);}
          else {
            var FriendQryResult = result;

            var qry3 = mysql.format('SELECT GameName, Games.GameID FROM Game_Library JOIN Games ON Games.GameID=Game_Library.GameID WHERE UserID=?', 
              UserID);
            console.log(qry3);
            cxn.connection.query(qry3, function(err, result) {
              if (err) {cxn.handleError(res, err);}
              else {
                var GameQryResult = result;

                var responseHTML = cxn.HTMLHeader + '<h1>'+UserQryResult[0].UserName+'</h1>\n\
                  <p>Email address: '+UserQryResult[0].UserEmail+'<br />\n\
                  Status: '+UserQryResult[0].UserStatus+
                  ' <a href="/users/status_edit?UserID='+UserID+'">(update)</a></p>\n'+

                  '<h2>Game Library</h2>\n';
                if (GameQryResult.length==0) {
                  responseHTML+='<p>'+UserQryResult[0].UserName+' has no games.</p>\n';
                }
                else {
                  responseHTML+='<ul>\n';
                  for(var i=0; i<GameQryResult.length; i++) {
                    responseHTML+='<li><a href="/games/view?GameID='+GameQryResult[i].GameID+'">'+GameQryResult[i].GameName+'</a> \
                      <a href="/addgame/del?UserID='+UserID+'&GameID='+GameQryResult[i].GameID+'">(remove)</a></li>\n';
                  }
                  responseHTML+='</ul>\n\
                    <p><a href="/addgame/add?UserID='+UserID+'">Add a game to this user\'s library</a></p>\n';
                }

                responseHTML+='<h2>Friends</h2>\n';
                if (FriendQryResult.length==0) {
                  responseHTML+='<p>'+UserQryResult[0].UserName+' has no friends :(</p>\n';
                }
                else {
                  responseHTML+='<ul>\n';
                  for(var i=0; i<FriendQryResult.length; i++) {
                    responseHTML+='<li><a href="/users/view?UserID='+FriendQryResult[i].UserID+'">'+FriendQryResult[i].UserName+'</a> \
                      <a href="/friendreq/del?UserID='+UserID+'&FriendID='+FriendQryResult[i].UserID+'">(remove)</a></li>\n';
                  }
                  responseHTML+='</ul>\n';
                }

                responseHTML+='<p><a href="/friendreq/add?UserID='+UserID+'">Add a friend</a></p>\n\
                  <p><a href="/users/edit?UserID='+UserID+'">Edit user profile</a><br />\n\
                  <a href="/users/delete?UserID='+UserID+'">Delete profile</a><br />\n\
                  <a href="/users">Back</a></p>\n';
                responseHTML+=cxn.HTMLFooter;
                res.send(responseHTML);
              }
            });
          }
        });
      }
    });
  },
  
  //New user signup
  add: function(req, res) {
    var responseHTML = cxn.HTMLHeader + '<h1>New user signup</h1>\n\
      <form action="/users/insert" method="post">\n\
      Username: <input name="UserName" type="text" /><br />\n\
      Password: <input name="UserPass" type="password" /><br />\n\
      Email Address: <input name="UserEmail" type="text" /><br />\n\
      <input type="submit" value="Submit" />\n\
      </form>\n' + cxn.HTMLFooter;
    res.send(responseHTML);
  },

  insert: function(req, res) {
    var qry1 = mysql.format('INSERT INTO Users SET ?', req.body);
    console.log(qry1);
    cxn.connection.query(qry1, function(err, result) {
      if (err) {cxn.handleError(res, err);}
      else {
        var qry2 = mysql.format('SELECT UserName,UserID FROM Users WHERE UserName=? AND UserEmail=?', [req.body.UserName, req.body.UserEmail]);
        console.log(qry2);
        cxn.connection.query(qry2, function(err, result) {
          if (err) {cxn.handleError(res, err);}
          else {
            var responseHTML = cxn.HTMLHeader + '<p>'+result[0].UserName+' successfully signed up with UserID '+result[0].UserID+'</p>\n\
              <p><a href="/users/view?UserID='+result[0].UserID+'">View profile</a><br />\n'+
              cxn.HTMLFooter;
            res.send(responseHTML);
          }
        });
      }
    });
  },

  //edit user profile
  edit: function(req, res) {
    var UserID = parseInt(req.query.UserID);
    var qry = mysql.format('SELECT * FROM Users WHERE UserID=?', UserID);
    console.log(qry);
    cxn.connection.query(qry, function(err, result) {
      if (err) {cxn.handleError(res, err);}
      else {
        var responseHTML = cxn.HTMLHeader + '<h1>Editing User Profile for '+result[0].UserName+'</h1>\n\
          <form action="/users/update" method="post">\n\
          <input type="hidden" name="UserID" value="'+UserID+'" />\n\
          Username: <input name="UserName" type="text" value="'+result[0].UserName+'" /><br />\n\
          Password: <input name="UserPass" type="password" value="'+result[0].UserPass+'" /><br />\n\
          Email Address: <input name="UserEmail" type="text" value="'+result[0].UserEmail+'" /><br />\n\
          <input type="submit" value="Submit" />\n\
          </form>\n'
          + cxn.HTMLFooter;
        res.send(responseHTML);
      }
    });
  },

  update: function(req, res) {
    var rBody = req.body;
    var UserID = parseInt(rBody.UserID);
    delete rBody.UserID;
    var qry = mysql.format('UPDATE Users SET ? WHERE UserID=?', [rBody, UserID]);
    console.log(qry);
    cxn.connection.query(qry, function(err, result) {
      if (err) {cxn.handleError(res, err);}
      else {
        var responseHTML = cxn.HTMLHeader + '<p>User profile for '+rBody.UserName+' successfully updated.</p>\
          <p><a href="/users/view?UserID='+UserID+'">View profile</a></p>\n'+
          cxn.HTMLFooter;
        res.send(responseHTML);
      }
    });
  },
  
  //update status
  status_edit: function(req, res) {
    var UserID = parseInt(req.query.UserID);
    var responseHTML = cxn.HTMLHeader + '<h1>Updating status for UserID '+UserID+'</h1>\n\
      <form action="/users/status/update" method="post">\n\
      <input type="hidden" name="UserID" value="'+UserID+'" />\n\
      <select name="UserStatus">\n\
        <option value="Offline">Offline</option>\n\
        <option value="Online">Online</option>\n\
        <option value="Away">Away</option>\n\
      </select>\n\
      <input type="submit" value="Submit" />\n\
      </form>\n'+cxn.HTMLFooter;
    res.send(responseHTML);
  },
  
  status_update: function(req, res) {
    var rBody = req.body;
    var UserID = req.body.UserID;
    delete rBody.UserID;
    var qry = mysql.format('UPDATE Users SET ? WHERE UserID=?', UserID);
    console.log(qry);
    cxn.connection.query(qry, function(err, result) {
      if (err) {cxn.handleError(res, err);}
      else {
        var responseHTML = '<p>Status for UserID '+UserID+' successfully updated to '+rBody.UserStatus+'.</p>\n\
          <p><a href="/users/view?UserID='+UserID+'">Back</a></p>\n'+cxn.HTMLFooter;
        res.send(responseHTML);
      }
    });
  },

  del: function(req, res) {
    var UserID = parseInt(req.query.UserID);
    var qry = mysql.format('DELETE FROM Users WHERE UserID=?', UserID);
    console.log(qry);
    cxn.connection.query(qry, function(err, result) {
      if (err) {cxn.handleError(res, err);}
      else {
        var responseHTML = cxn.HTMLHeader + '<p>Successfully deleted profile with UserID '+UserID+'</p>\n\
          <p><a href="/users">Back</a></p>\n'+
          cxn.HTMLFooter;
        res.send(responseHTML);
      }
    });
  }        
}
