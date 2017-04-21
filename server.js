// silly chrome wants SSL to do screensharing
var fs = require('fs'),
	crypto = require('crypto'),
	express = require('express'),
	http = require('http'),
	https = require('https');



var app = express();

app.all('*', ensureSecure); // at top of routing calls

app.use(express.static(__dirname));

app.engine('.html', require('ejs').__express);
http.createServer(app).listen(80);
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

function ensureSecure(req, res, next){
  if(req.secure){
    // OK, continue
    return next();
  };
  // handle port numbers if you need non defaults
  // res.redirect('https://' + req.host + req.url); // express 3.x
  res.redirect('https://' + req.hostname + req.url); // express 4.x
}
