
"use strict";
var business = require('./business');

function listSongs(request, response) {
	business.listSongs(function(err, result) {
		response.send(result);

	})
}

function getSong(request, response) {
	var sOId = request.params.oid || '';
	business.getSong(sOId, function(err, result) {
		response.send(result);
	});
}

function insertSong(request, response) {
	var doc = request.body;
	business.insertSong(doc, function(err, result) {
		response.send(result);
	})
}

exports.getSong = getSong;
exports.listSongs = listSongs;
exports.insertSong = insertSong;
