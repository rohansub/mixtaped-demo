// silly chrome wants SSL to do screensharing
var express = require('express'),
	http = require('http');

var app = express();

app.use(express.static(__dirname));
app.engine('.html', require('ejs').__express);
http.createServer(app).listen(8000);

app.get("/broadcast", function(req, res) {
    res.render(__dirname + "/broadcast.html");
});

app.get("/watch/:tagId", function(req, res) {
	res.render(__dirname + "/watch.html", {
		user: req.params.tagId
	});
});



console.log('running on http://localhost:8000');
