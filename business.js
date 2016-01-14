
"use strict";

var model = require('./model');

function joinFeeds (aShows, aGames, callback) {
	var aReturn = [];
	var idShow;
	var idGame;
	var oJoin;
	aShows.forEach(function(show){
		idShow = show.id;
		aGames.some(function(game){
			idGame = game.id;
			if (idGame === idShow) {
				aReturn.push(Object.assign(show, game));
				return true;																	//short circuit the inner array loop
			}
		});
	});
	callback(null, aReturn);
}

function listSongs(callback){
	model.listSongs(function(err, aSongs){
		callback(err,aSongs);
	});
}

function getSong(id, callback){
	model.getSong(id,function(err, aSongs){
		callback(err,aSongs);
	});
}

function insertSong(doc, callback){
	model.insertSong(doc, callback);
}

exports.getSong = getSong;
exports.listSongs = listSongs;
exports.insertSong = insertSong;
exports.joinFeeds = joinFeeds;



