
'use strict';

var Server = require('mongodb').Server;
var server = new Server('localhost',27017);
var mongoDb = require('mongodb').Db;
var db = new mongoDb('tbs', server, {safe: true});
var ObjectId = require('mongodb').ObjectID;

function initDb(callback) {
    console.log('model.initDb');
    var statusResponse;

    db.open(function (err, db) {
      callback(err, {modelName: 'model', dbName: 'tbs'});  
    });

}//


function listSongs(callback){
    var oSong;
    db.collection('Songs', {safe: true},
      function(err, collection){
         collection.find()
            .toArray(function (err, data) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, data);
                }
            });
      });
}


function getSong(id, callback){
  var oSong;
  db.collection('Songs', {safe: true},
    function(err, collection){
      var oId = new ObjectId(id);
      collection.findOne({_id: oId},function (err, data) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, data);
        }
      });
    });

}

function insertSong(doc, callback){
  var oSong;
  db.collection('Songs', {safe: true},
      function(err, collection){
        collection.insert(doc, function (err, data) {
          if (err) {
            callback(err, null);
          } else {
            callback(null, data);
          }
        });
      });

}

exports.getSong = getSong;
exports.listSongs = listSongs;
exports.db = db;
exports.initDb = initDb;
exports.insertSong = insertSong;


