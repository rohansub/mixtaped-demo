// silly chrome wants SSL to do screensharing
var fs = require('fs'),
	crypto = require('crypto'),
	express = require('express'),
	http = require('http'),
	https = require('https');

var app = express();
app.use(express.static(__dirname));

http.createServer(app).listen(80);
console.log('running on http://localhost:80');

try {
	var privateKey = fs.readFileSync('/etc/letsencrypt/live/touhou.live/privkey.pem'),
		certificate = fs.readFileSync('/etc/letsencrypt/live/touhou.live/cert.pem');
	console.log(privateKey);
	console.log(certificate);
	
	https.createServer({key: privateKey, cert: certificate}, app).listen(443);
	console.log('running on https://localhost:443');
} catch (err) {
	console.log('cannot start https server\n', err);
}
