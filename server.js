// silly chrome wants SSL to do screensharing
var fs = require('fs'),
	express = require('express'),
	http = require('http'),
	https = require('https');

var app = express();
app.use(express.static(__dirname));
app.engine('.html', require('ejs').__express);

app.get("/broadcast", function(req, res) {
	res.render(__dirname + "/broadcast.html");
});

app.get("/watch/:tagId", function(req, res) {
	res.render(__dirname + "/watch.html", {
		user: req.params.tagId
	});
});

try {
	var privateKey = fs.readFileSync('/etc/letsencrypt/live/mixtaped.tv/privkey.pem'),
		certificate = fs.readFileSync('/etc/letsencrypt/live/mixtaped.tv/cert.pem');
	console.log('[mixtaped] private key\n', privateKey);
	console.log('[mixtaped] certificate\n', certificate);

	https.createServer({key: privateKey, cert: certificate}, app).listen(443);
	console.log('[mixtaped] server running on https://localhost:443');

	var httpApp = express();
	httpApp.all('*', function (req, res, next) {
		res.redirect('https://' + req.hostname + req.url);
	});
	http.createServer(httpApp).listen(80);
	console.log('[mixtaped] reroute server running on http://localhost:80');
} catch (err) {
	console.log('[mixtaped] cannot start https server\n', err);

	// Local development;
	http.createServer(app).listen(8090);
	console.log('[mixtaped] server running on http://localhost:8090');
}
