var npm = require('npm');
var fs = require('fs');
var express = require('express');
var app = express();
var http = require('http').createServer(app);
app.set('port', (process.env.PORT || 5000));

var SEARCH_TERMS = 'hubot-scripts';
var RESULT_FILENAME = 'public/cache.json';
var REFRESH_FREQUENCY = 14400000; // 4 hours.

function getScripts(callback) {
	console.log('Getting available scripts..');
	npm.load({}, function() {
		npm.commands.search(SEARCH_TERMS, true, 0, function(err, data) {
			if (err) {
				console.log('Error!', err);
				return;
			}
			console.log('Retrieved packages.');
			callback(data);
		});
	});
}

function saveResultsToFile(data) {
	console.log('Saving results to file..');

	fs.writeFile(RESULT_FILENAME, JSON.stringify(sanitiseResults(data)), function(err) {
		if (err) {
			console.log(err);
		}
	});
}

function sanitiseResults(data) {

	// Add a 'meta' section to the data.
	return {
		meta: {
			lastRefreshed: new Date(),
		},
		packages: data
	};
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