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
	var privateKey = fs.readFileSync('/etc/letsencrypt/keys/0000_key-certbot.pem'),
		certificate = fs.readFileSync('/etc/letsencrypt/csr/0000_csr-certbot.pem');
	console.log(privateKey, certificate);
	
	https.createServer({key: privateKey, cert: certificate}, app).listen(443);
	console.log('running on https://localhost:443');
} catch (err) {
	console.log('cannot start https server', err);
}
