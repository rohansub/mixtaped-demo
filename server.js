// silly chrome wants SSL to do screensharing
var express = require('express'),
	http = require('http');

var app = express();

app.use(express.static(__dirname));

http.createServer(app).listen(8000);

console.log('running on http://localhost:8000');
