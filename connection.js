var mysql = require('mysql');
var fs = require('fs');

//Provides the connection object and a few other global things
exports.connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'username',
  password : 'password',
  database : 'database'
});

exports.handleError = function (res, error){
    console.error(error);
    res.send(error.toString());
}

exports.HTMLHeader = fs.ReadFileSync('header.html');
exports.HTMLFooter = fs.ReadFileSync('footer.html');
