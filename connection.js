var mysql = require('mysql');
var fs = require('fs');

//Provides the connection object and a few other global things
exports.connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'derek',
  password : 'swordfish707',
  database : 'Project1'
});

exports.handleError = function (res, error){
    console.error(error);
    res.send(error.toString());
}

exports.HTMLHeader = fs.readFileSync('header.html');
exports.HTMLFooter = fs.readFileSync('footer.html');
