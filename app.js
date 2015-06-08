var npm = require('npm');
var fs = require('fs');
var express = require('express');
var app = express();
var http = require('http').createServer(app);

var SEARCH_TERMS = 'hubot-scripts';
var RESULT_FILENAME = 'public/cache.json';

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

// TODO refresh every hour.

app.use('/', express.static('public'));

app.listen(7247, function() {
	console.log('Express server running..');
});