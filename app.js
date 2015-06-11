var npm = require('npm');
var fs = require('fs');
var express = require('express');
var app = express();
var https = require('https');

app.set('port', (process.env.PORT || 5000));

var SEARCH_TERMS = 'hubot-scripts';
var RESULT_FILENAME = 'public/cache.json';
var PACKAGES_LOCATION = 'https://skimdb.npmjs.com/registry/_design/app/_view/byKeyword?startkey=[%22' + SEARCH_TERMS + '%22]&endkey=[%22' + SEARCH_TERMS + '%22,{}]&group_level=3';
var REFRESH_FREQUENCY = 14400000; // 4 hours.

function getScripts(callback) {
	console.log('Getting available scripts..');

	var request = https.get(PACKAGES_LOCATION, function(response) {

		var completeResponse = "";

		console.log('Response incoming..');
		response.on('data', function(chunk) {
			completeResponse += chunk;
		});
		response.on('end', function() {
			callback(completeResponse);
		});		
	});
}

function saveResultsToFile(data) {

	fs.writeFile(RESULT_FILENAME, sanitiseResults(data), function(err) {
		if (err) {
			console.log(err);
		}
		console.log('Package list updated. See ' + RESULT_FILENAME);
	});
}

function sanitiseResults(data) {

	/*
	Takes the response, does some processing on it and adds a 'meta'
	object to store additional info.
	*/

	try {
		data = JSON.parse(data);
	}
	catch (ex) {
		console.log("Could not parse response into JSON.", ex);
		return "";
	}

	var sanitised = {
		meta: {
			lastRefreshed: new Date()
		},
		packages: []
	};

	if (data.rows) {
		for (var i in data.rows) {
			var package = data.rows[i];
			if (package.key) {
				var sanitisedPackage = {
					name: package.key[1] || '',
					description: package.key[2] || ''
				}
				sanitised.packages.push(sanitisedPackage);
			}
		}
	}

	return JSON.stringify(sanitised);
}

// On load, refresh scripts.
getScripts(saveResultsToFile);

// Refresh every X ms.
setInterval(function() {
	getScripts(saveResultsToFile);
}, REFRESH_FREQUENCY);

// TODO refresh every hour.

app.use('/', express.static('public'));

app.listen(app.get('port'), function() {
	console.log('Express server running on port ' + app.get('port'));
});