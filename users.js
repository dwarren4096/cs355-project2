var cxn		= require('./connection.js');
var mysql	= require('mysql');

module.exports = {
	// List all users
	index: function(req, res) {
		var qry = 'SELECT UserID, UserName, UserEmail FROM Users';
		cxn.connection.query(qry, function(err, result) {
			if (err) {cxn.handleError(res, err);}
			else {
				var responseHTML = cxn.HTMLHeader + '<h1>Users</h1>\n<table border=1>\n<tr>\n\
					<th>UserID</th>\n\
					<th>UserName</th>\n\
					<th>UserEmail</th>\n</tr>\n';

				for (var i=0; i < result.length; i++) {
					responseHTML += '<tr>\n<td>'+result[i].UserID+'</td>\n\
						<td><a href="/users/view?UserID='+result[i].UserID+'">'+result[i].UserName+'</a></td>\n\
						<td>$'+result[i].UserEmail+'</td>\n\
						</tr>\n';
				}
				responseHTML += '</table>\n\
					<p><a href="/users/add">Add a new user</a><br />\n\
					<a href="/">Back</a></p>\n' + cxn.HTMLFooter;
				res.send(responseHTML);
			}
		});
	},

	//View detailed info on a user
	view: function(req, res) {
		var UserID = parseInt(req.query.UserID);
		var qry1 = mysql.format('SELECT UserID, UserName, UserEmail FROM Users WHERE UserID=?', UserID);
		cxn.connection.query(qry1, function(err, result) {
			if (err) {cxn.handleError(res, err);}
			else {
				var UserQryResult = result;

				var qry2 = mysql.format('SELECT Users.UserID, Users.UserName FROM Friends_List \
					RIGHT JOIN Users ON Friends_List.FriendID = Users.UserID WHERE Friends_List.UserID=?',
					UserID);
				cxn.connection.query(qry2, function(err, result) {
					if (err) {cxn.handleError(res, err);}
					else {
						var FriendQryResult = result;
						var responseHTML = cxn.HTMLHeader + '<h1>'+UserQryResult[0].UserName+'</h1>\n\
							<p>Email address: '+UserQryResult[0].UserEmail+'<br />\n\
							Status: '+UserQryResult[0].UserStatus+'</p>\
							<h2>Friends</h2>\n\
							<ul>\n';
						for(var i=0; i<FriendQryResult.length; i++) {
							responseHTML+='<li><a href="/users/view?UserID='+FriendQryResult[i].UserID+'">'+FriendQryResult[i].UserName+'</a></li>\n';
						}
						responseHTML+='</ul>\n';
						responseHTML+=cxn.HTMLFooter;
						res.send(responseHTML);
					}
				});
			}
		});
	},
	
	add: function(req, res) {
	}
}
