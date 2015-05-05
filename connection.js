var mysql = require('mysql');

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

exports.HTMLHeader = '<html>\n<head><title>Vapor Game Distribution</title></head>\n<body>\n';
exports.HTMLFooter = '</body>\n</html>';
