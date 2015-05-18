var cxn   = require('./connection.js');
var mysql = require('mysql');

module.exports = {
  // Lists all games in the catalog
  index: function(req, res) {
    var qry = 'SELECT GameID, GameName, Price FROM Games';
    cxn.connection.query(qry, function(err, result) {
      if (err) {
        cxn.handleError(res, err);
      }
      else {
        var responseHTML = cxn.HTMLHeader;
        for (var i=0; i<result.length; i++) {
          responseHTML += '<div class="game">\n\
            <a href="/games/view?GameID='+result[i].GameID+'"><img class="gamecover" src="/images/'+result[i].GameID+'.jpg" alt="'+result[i].GameName+'" /></a>\n\
            <a href="/games/view?GameID='+result[i].GameID+'"><p class="gametext">'+result[i].GameName+'</a><br />\n\
            $'+result[i].Price+'\n</div>';
        }
        responseHTML+='<div style="clear:both">\n<p><a href="/games/add">Add a new game</a></p>\n</div>\n'+
          cxn.HTMLFooter;
        res.send(responseHTML);
      }
    });
  },
  
  // Lists info for a specific game
  view: function(req, res) {
    var rGameID = parseInt(req.query.GameID);
    var qry = mysql.format('SELECT * FROM GamesDetail WHERE GameID=?', rGameID);
    console.log(qry);
    cxn.connection.query(qry, function(err, result) {
      if (err) {cxn.handleError(res, err);}
      else {
        console.log(result.length);
        console.log(result);
        var responseHTML = cxn.HTMLHeader + '<h2>'+result[0].GameName+'</h2>\n\
          <div class="gameviewcover">\n\
          <img src="/images/'+rGameID+'.jpg" alt="'+result[0].GameName+'" width=100% />\n\
          </div>\n\
          <div class="gameviewtext">\n\
          <ul>\n\
            <li>Price: $'+result[0].Price+'</li>\n\
            <li>Rating: '+result[0].Rating+'</li>\n\
            <li>Release Date: '+result[0].ReleaseDate+'</li>\n\
            <li>Genre: '+result[0].Genre+'</li>\n\
            <li>Developed by: <a href="/devs/view?DevID='+result[0].DevID+'">'+result[0].DevName+'</a></li>\n\
          </ul>\n';
        
        if (result[0].DLCName != null) {
          responseHTML+='<h3>DLC</h3>\n\
            <table border=1>\n<tr>\n\
              <th>DLC Name</th>\n\
              <th>Price</th>\n\
              <th>Release date:</th>\n</tr>\n';
          for (var i=0; i < result.length; i++) {
            //GameID and DLCName are combined unique key, send both to /dlc/edit
            responseHTML+='<td><a href="/dlc/edit?GameID='+rGameID+'&DLCName='+result[i].DLCName+'">'+result[i].DLCName+'</a></td>\n\
              <td>'+result[i].DLCPrice+'</td>\n\
              <td>'+result[i].DLCReleaseDate+'</td>\n</tr>\n';
          }
          responseHTML+='</table>\n';
        }
        responseHTML+='</div>\n';
              
          
          /*<table border=1>\n<tr>\n\
          <th>GameName</th>\n\
          <th>Price</th>\n\
          <th>Genre</th>\n\
          <th>ReleaseDate</th>\n\
          <th>Rating</th>\n\
          <th>DevelopedBy</th>\n\
          <th>DLCName</th>\n\
          <th>DLCPrice</th>\n\
          <th>DLCReleaseDate</th>\n</tr>\n';
        responseHTML += '<tr>\n<td>'+result[0].GameName+'</td>\n\
          <td>$'+result[0].Price+'</td>\n\
          <td>'+result[0].Genre+'</td>\n\
          <td>'+result[0].ReleaseDate+'</td>\n\
          <td>'+result[0].Rating+'</td>\n\
          <td><a href="/devs/view?DevID='+result[0].DevelopedBy+'">'+result[0].DevName+'</a></td>\n'; //TODO: Join this on the Devs table

        if (result[0].DLCName == null) {
          responseHTML += '<td colspan=3>No DLC available for this game.</td>\n</tr>\n';
        }
        else {
          //append first DLC to first row, subsequent DLC gets its own rows
          //GameID and DLCName are combined unique key, send both to /dlc/edit
          responseHTML += '<td><a href="/dlc/edit?GameID='+rGameID+'&DLCName='+result[0].DLCName+'">'+result[0].DLCName+'</a></td>\n\
            <td>$'+result[0].DLCPrice+'</td>\n\
            <td>'+result[0].DLCReleaseDate+'</td>\n</tr>\n';
          for (var i=1; i<result.length; i++) {
            responseHTML += '<tr>\n<td colspan=6></td>\n\
              <td><a href="/dlc/edit?GameID='+rGameID+'&DLCName='+result[i].DLCName+'">'+result[i].DLCName+'</a></td>\n\
              <td>$'+result[i].DLCPrice+'</td>\n\
              <td>'+result[i].DLCReleaseDate+'</td>\n</tr>\n';
          }
        }*/
        responseHTML += '<div style="clear:both">\n\
          <p><a href="/games/edit?GameID='+rGameID+'">Edit game data</a><br />\n\
          <a href="/dlc/add?GameID='+rGameID+'">Add DLC to this game</a><br />\n\
          <a href="/games/delete?GameID='+rGameID+'">Delete this game</a><br />\n\
          <a href="/games">Back</a></p>\n\
          </div>\n' + cxn.HTMLFooter;
        res.send(responseHTML);
      }
    });
  },

  //Form for adding new games
  add: function(req, res) {
    var qry = 'SELECT DevID,DevName FROM Developers';
    cxn.connection.query(qry, function(err, result) {
      if (err) {
        cxn.handleError(res, err);
      }
      else {
        var responseHTML = cxn.HTMLHeader + '<h1>Add a new game</h1>\n\
          <form action="/games/insert" method="post">\n\
          GameName: <input type="text" name="GameName" /><br />\n\
          Price: $<input type="text" name="Price" /><br />\n\
          Genre: <input type="text" name="Genre" /><br />\n\
          ReleaseDate (yyyy-mm-dd): <input type="text" name="ReleaseDate" /><br />\n\
          Rating: <select name="Rating">\n\
            <option value="NR">No rating</option>\n\
            <option value="E">E</option>\n\
            <option value="T">T</option>\n\
            <option value="M">M</option>\n</select><br />\n';

        responseHTML += 'DevelopedBy: <select name="DevelopedBy">\n';
        for (var i=0; i<result.length; i++) {
          responseHTML += '<option value="'+result[i].DevID+'">' +
              result[i].DevName + '</option>\n';
        }
        responseHTML += '</select><br />\n<input type="submit" value="Submit" />\n\
          </form>\n' + cxn.HTMLFooter;
        res.send(responseHTML);
      }
    });
  },

  // Inserts new game data into DB
  insert: function(req ,res) {
    var qry1 = mysql.format('INSERT INTO Games SET ?', req.body);
    console.log(qry1);
    cxn.connection.query(qry1, function(err, result) { 
      if (err){cxn.handleError(res, err);}
      else {
        var qry2 = mysql.format('SELECT GameID,GameName FROM Games WHERE GameName=?', req.body.GameName);
        console.log(qry2);
        cxn.connection.query(qry2, function(err, result) {
          if (err) {cxn.handleError(res, err);}
          else {
            var responseHTML=cxn.HTMLHeader+'<p><strong>'+result[0].GameName+' successfully inserted into the database with GameID '+result[0].GameID+
              '.</strong></p>\n' +
              '<p>\n<a href="/dlc/add?GameID='+result[0].GameID+'&GameName='+result[0].GameName+'">Add DLC to this game</a><br />\n' +
              '<a href="/games">Back to Games Catalog</a></p>\n';
            responseHTML+=cxn.HTMLFooter;
            res.send(responseHTML);
          }
        });
      }
    });
  },
  
  // form for editing game data
  edit: function(req, res) {
    var rGameID = parseInt(req.query.GameID);
    var qry = mysql.format('SELECT * FROM Games WHERE GameID=?', rGameID);
    console.log(qry);
    cxn.connection.query(qry, function(err, result) {
      if (err) {cxn.handleError(res, err);}
      else {
        var GameQryResult = result;
        cxn.connection.query('SELECT DevID,DevName FROM Developers', function(err,result) {
          if (err) {cxn.handleError(res, err);}
          else {
            var DevQryResult = result;
            var responseHTML = cxn.HTMLHeader + '<h1>Editing info for GameID '+rGameID+'</h1>\n\
              <form action="/games/update" method="post">\n\
              <input type="hidden" name="GameID" value="'+rGameID+'" />\n\
              GameName: <input type="text" name="GameName" value="'+GameQryResult[0].GameName+'" /><br />\n\
              Price: $<input type="text" name="Price" value="'+GameQryResult[0].Price+'" /><br />\n\
              Genre: <input type="text" name="Genre" value="'+GameQryResult[0].Genre+'" /><br />\n\
              ReleaseDate (yyyy-mm-dd): <input type="text" name="ReleaseDate" value="'+GameQryResult[0].ReleaseDate+'" /><br />\n\
              Rating: <select name="Rating">\n\
                <option value="NR">No rating</option>\n\
                <option value="E">E</option>\n\
                <option value="T">T</option>\n\
                <option value="M">M</option>\n</select><br />\n';

            responseHTML += 'DevelopedBy: <select name="DevelopedBy">\n';
            for (var i=0; i<DevQryResult.length; i++) {
              responseHTML += '<option value="'+DevQryResult[i].DevID+'">' +
                result[i].DevName + '</option>\n';
            }
            responseHTML += '</select><br />\n<input type="submit" value="Submit" />\n\
              </form>\n' + cxn.HTMLFooter;
            res.send(responseHTML);
          }
        });
      }
    });
  },

  // send updated data to DB
  update: function(req, res) {
    //primary key is not to be updated, spin it off into its own variable then delete it from req.body
    var rGameID = parseInt(req.body.GameID);
    var rBody = req.body;
    delete rBody.GameID;
    var qry = mysql.format('UPDATE Games SET ? WHERE GameID=?', [rBody, rGameID]);
    console.log(qry);
    cxn.connection.query(qry, function(err, result) {
      if (err) {cxn.handleError(res, err);}
      else {
        var responseHTML = cxn.HTMLHeader + '<p>Successfully updated GameID ' + rGameID + '.</p>\n\
          <p><a href="/games/view?GameID='+rGameID+'">Back</a></p>\n' + cxn.HTMLFooter;
        res.send(responseHTML);
      }
    });
  },

  // delete game from DB
  del: function(req, res) {
    var rGameID = parseInt(req.query.GameID);
    var qry = mysql.format('DELETE FROM Games WHERE GameID=?', rGameID);
    console.log(qry);
    cxn.connection.query(qry, function(err, result) {
      if (err) {cxn.handleError(res, err);}
      else {
        var responseHTML = cxn.HTMLHeader + '<p>Successfully deleted GameID '+rGameID+' from the database.</p>\n\
          <p><a href="/games">Back to Games Catalog</a></p>\n' + cxn.HTMLFooter;
        res.send(responseHTML);
      }
    });
  }
};
