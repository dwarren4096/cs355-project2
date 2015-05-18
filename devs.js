var cxn   = require('./connection.js');
var mysql = require('mysql');

module.exports = {
  // List all devs
  index: function(req, res) {
    var qry = 'SELECT * FROM Developers';
    cxn.connection.query(qry, function(err, result) {
      if (err) {cxn.handleError(res, err);}
      else {
        var responseHTML = cxn.HTMLHeader + '<h2>Developers</h2>\n\
          <table border=1>\n<tr>\n\
            <th>DevID</th>\n\
            <th>DevName</th>\n\
            <th>DevWebsite</th>\n</tr>\n';

        for (var i=0; i < result.length; i++) {
          //add http:// to DevWebsite if it's not there
          if (!/^https?:\/\//i.test(result[i].DevWebsite)) {
            result[i].DevWebsite = 'http://' + result[i].DevWebsite;
          }
          responseHTML += '<tr>\n<td>'+result[i].DevID+'</td>\n\
            <td><a href="/devs/view?DevID='+result[i].DevID+'">'+result[i].DevName+'</a></td>\n\
            <td><a href="'+result[i].DevWebsite+'">'+result[i].DevWebsite+'</a></td>\n\
            </tr>\n';
        }
        responseHTML += '</table>\n\
          <p><a href="/devs/add">New Dev signup</a><br />\n\
          <a href="/">Back</a></p>\n' + cxn.HTMLFooter;
        res.send(responseHTML);
      }
    });
  },

  //View detailed info on a Dev
  view: function(req, res) {
    var DevID = parseInt(req.query.DevID);
    var qry1 = mysql.format('SELECT * FROM Developers WHERE DevID=?', DevID);
    console.log(qry1);
    cxn.connection.query(qry1, function(err, result) {
      if (err) {cxn.handleError(res, err);}
      else {
        var DevQryResult = result;
        //add http:// to DevWebsite if it's not there
        if (!/^https?:\/\//i.test(DevQryResult[0].DevWebsite)) {
          DevQryResult[0].DevWebsite = 'http://' + DevQryResult[0].DevWebsite; 
        }

        var qry2 = mysql.format('SELECT GameID,GameName, GamesDeveloped(?) FROM Games WHERE DevelopedBy=?', [DevID, DevID]);
        console.log(qry2);
        cxn.connection.query(qry2, function(err, result) {
          if (err) {cxn.handleError(res, err);}
          else {
            var GameQryResult = result;
            console.log(GameQryResult);
            var responseHTML = cxn.HTMLHeader + '<h2>'+DevQryResult[0].DevName+'</h2>\n\
              <p>Website: <a href="'+DevQryResult[0].DevWebsite+'">'+DevQryResult[0].DevWebsite+'</a></p>\n\
              <h3>Games Developed ('+DevQryResult[0].GamesDeveloped(DevID)+')</h3>\n';
            if (GameQryResult.length==0) {
              responseHTML+='<p>This developer does not have any games.<br />\n\
                <a href="/games/add">Click here to add a new game.</a></p>\n';
            }
            else {
              responseHTML+='<ul>\n';
              for(var i=0; i<GameQryResult.length; i++) {
                responseHTML+='<li><a href="/games/view?GameID='+GameQryResult[i].GameID+'">'+GameQryResult[i].GameName+'</a></li>\n';
              }
              responseHTML+='</ul>\n';
            }
            responseHTML+='<p><a href="/devs/edit?DevID='+DevID+'">Edit Dev profile</a><br />\n\
              <a href="/devs/delete?DevID='+DevID+'">Delete profile</a><br />\n\
              <a href="/devs">Back</a></p>\n';
            responseHTML+=cxn.HTMLFooter;
            res.send(responseHTML);
          }
        });
      }
    });
  },
  
  //New Dev signup
  add: function(req, res) {
    var responseHTML = cxn.HTMLHeader + '<h1>New Developer signup</h1>\n\
      <form action="/devs/insert" method="post">\n\
      Company Name: <input name="DevName" type="text" /><br />\n\
      Website: <input name="DevWebsite" type="text" /><br />\n\
      <input type="submit" value="Submit" />\n\
      </form>\n' + cxn.HTMLFooter;
    res.send(responseHTML);
  },

  insert: function(req, res) {
    //add http:// to DevWebsite if it's not there
    if (!/^https?:\/\//i.test(req.body.DevWebsite)) {
      req.body.DevWebsite = 'http://' + req.body.DevWebsite;
    }
    var qry1 = mysql.format('INSERT INTO Developers SET ?', req.body);
    console.log(qry1);
    cxn.connection.query(qry1, function(err, result) {
      if (err) {cxn.handleError(res, err);}
      else {
        var qry2 = mysql.format('SELECT DevName,DevID FROM Developers WHERE DevName=?', req.body.DevName);
        console.log(qry2);
        cxn.connection.query(qry2, function(err, result) {
          if (err) {cxn.handleError(res, err);}
          else {
            var responseHTML = cxn.HTMLHeader + '<p>'+result[0].DevName+' successfully signed up with DevID '+result[0].DevID+'</p>\n\
              <p><a href="/devs/view?DevID='+result[0].DevID+'">View profile</a><br />\n'+
              cxn.HTMLFooter;
            res.send(responseHTML);
          }
        });
      }
    });
  },

  edit: function(req, res) {
    var DevID = parseInt(req.query.DevID);
    var qry = mysql.format('SELECT * FROM Developers WHERE DevID=?', DevID);
    console.log(qry);
    cxn.connection.query(qry, function(err, result) {
      if (err) {cxn.handleError(res, err);}
      else {
        var responseHTML = cxn.HTMLHeader + '<h1>Editing Developer Profile for '+result[0].DevName+'</h1>\n\
          <form action="/devs/update" method="post">\n\
          <input type="hidden" name="DevID" value="'+DevID+'" />\n\
          Company Name: <input name="DevName" type="text" value="'+result[0].DevName+'" /><br />\n\
          Website: <input name="DevWebsite" type="text" value="'+result[0].DevWebsite+'" /><br />\n\
          <input type="submit" value="Submit" />\n\
          </form>\n'
          + cxn.HTMLFooter;
        res.send(responseHTML);
      }
    });
  },

  update: function(req, res) {
    var rBody = req.body;
    var DevID = parseInt(rBody.DevID);
    delete rBody.GameID;
    //add http:// to DevWebsite if it's not there
    if (!/^https?:\/\//i.test(req.body.DevWebsite)) {
      req.body.DevWebsite = 'http://' + req.body.DevWebsite;
    }
    var qry = mysql.format('UPDATE Developers SET ? WHERE DevID=?', [rBody, DevID]);
    console.log(qry);
    cxn.connection.query(qry, function(err, result) {
      if (err) {cxn.handleError(res, err);}
      else {
        var responseHTML = cxn.HTMLHeader + '<p>Dev profile for '+rBody.DevName+' successfully updated.</p>\
          <p><a href="/devs/view?DevID='+DevID+'">View profile</a></p>\n'+
          cxn.HTMLFooter;
        res.send(responseHTML);
      }
    });
  },

  del: function(req, res) {
    var DevID = parseInt(req.query.DevID);
    var qry = mysql.format('DELETE FROM Developers WHERE DevID=?', DevID);
    console.log(qry);
    cxn.connection.query(qry, function(err, result) {
      if (err) {cxn.handleError(res, err);}
      else {
        var responseHTML = cxn.HTMLHeader + '<p>Successfully deleted profile with DevID '+DevID+'</p>\n\
          <p><a href="/devs">Back</a></p>\n'+
          cxn.HTMLFooter;
        res.send(responseHTML);
      }
    });
  }
}
