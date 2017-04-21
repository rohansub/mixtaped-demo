// silly chrome wants SSL to do screensharing
var fs = require('fs'),
	crypto = require('crypto'),
	express = require('express'),
	http = require('http'),
	https = require('https');

var redirectApp = express () ,
redirectServer = http.createServer(redirectApp);
redirectApp.use(function requireHTTPS(req, res, next) {
  	if (!req.secure) {
	  	return res.redirect('https://' + req.headers.host + req.url);
	}
	next();
})
redirectServer.listen(80);


var app = express();
app.use(express.static(__dirname));
app.engine('.html', require('ejs').__express);
// http.createServer(app).listen(80);
console.log('running on http://localhost:80');
http.get('*',function(req,res){
    res.redirect('https://localhost:443'+req.url)
})
try {
	var privateKey = fs.readFileSync('/etc/letsencrypt/live/touhou.live/privkey.pem'),
		certificate = fs.readFileSync('/etc/letsencrypt/live/touhou.live/cert.pem');
	// console.log(privateKey);
	// console.log(certificate);

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
