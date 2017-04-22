// silly chrome wants SSL to do screensharing
var fs = require('fs'),
	crypto = require('crypto'),
	express = require('express'),
	http = require('http'),
	https = require('https');

var app = express();
app.use(express.static(__dirname));
app.engine('.html', require('ejs').__express);


var httpApp = express();
httpApp.all('*', function (req, res, next) {
	res.redirect('https://mixtaped.tv');
});
http.createServer(httpApp).listen(80);
console.log('running on http://localhost:80');

try {
	var privateKey = fs.readFileSync('/etc/letsencrypt/live/mixtaped.tv/privkey.pem'),
		certificate = fs.readFileSync('/etc/letsencrypt/live/mixtaped.tv/cert.pem');
	console.log(privateKey);
	console.log(certificate);

	https.createServer({key: privateKey, cert: certificate}, app).listen(443);
	console.log('running on https://localhost:443');
} catch (err) {
	console.log('cannot start https server\n', err);
}


app.get("/broadcast", function(req, res) {
    res.render(__dirname + "/broadcast.html");
});

app.get("/watch/:tagId", function(req, res) {
	res.render(__dirname + "/watch.html", {
		user: req.params.tagId
	});
});
