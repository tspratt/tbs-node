var express = require('express');
var model = require('./model');
var routes = require('./routes');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/songs', routes.listSongs);
app.get('/songs/:oid', routes.getSong);
app.post('/song', routes.insertSong);

model.initDb(function(err, db){
  app.listen(8080);
  console.log('tbs-test app listening on port 8080')
});


module.exports = app;
