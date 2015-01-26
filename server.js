var express = require('express');
var fs = require('fs');
var http = require('http');
var https = require('https');
var path = require('path');

app = express()

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
	res.render('index');
});

app.get('/search', function (req, res) {
	if (req.query['query'] === "") {
		console.log("You entered an empty query!");
		res.render('index');
		return;
	}
	var query = req.query['query'];
	var url = "http://suggestqueries.google.com/complete/search?client=firefox&q="+encodeURIComponent(query);
	// console.log("Send request: " + url);
	var data = "";
	var req2 = http.get(url, function (res2) {
		res2.setEncoding('utf8');
		// console.log("Received response: ", res2.headers);
		res2.on('data', function (d) {
				res.render('results', {
					data : JSON.parse(d)
				});
		});
	}).on('error', function (e) {
		console.log("Problem with request: " + e);
	});
	req2.end();
});

var server = app.listen(3000, function () {
	console.log("Listening on port %d", server.address().port);
});