var express = require('express'),
    errorHandler = require('errorhandler'),
    app = express(),
	proxy = require('express-http-proxy');

var HOSTNAME = 'localhost',
    PORT = 8800,
    PUBLIC_DIR = __dirname + '/public_html',
    requestsCount = 0;

app.use(function (req, res, done) {
	var date = Date();
	console.log("[%s] [%s] [%s]", requestsCount++, req.url.toLocaleString(), date.toLocaleString());
	done();
});

app
	.use('/', express.static(PUBLIC_DIR))
	.use(errorHandler());

app.listen(PORT, function () {
	console.log("Simple static server showing %s listening at http://%s:%s",
		PUBLIC_DIR, HOSTNAME, PORT);
});

app.use('/proxy', proxy('http://vk.com', {
	forwardPath: function(req, res) {
		console.log(1234);
		return require('url').parse(req.url).path;
	}
}));
