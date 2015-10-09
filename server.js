var falcorExpress = require('falcor-express');
var Router = require('falcor-router');

var express = require('express');
var app = express();

var imdbRouter = require('./index');

var movieJson = {
	lastMovie:  '',
	fordMovies: ['Blade runner',
	'indiana jones',
	'Star Wars: Episode VII - The Force Awakens'],
	stalloneMovies: ['Rambo',
	'Cobra',
	'Rocky']
}


app.use('/model.json', falcorExpress.dataSourceRoute(function (req, res) {
  if(req.query.title) movieJson.lastMovie = req.query.title;
  return new imdbRouter(movieJson);
}));

app.use(express.static(__dirname + '/public'));

var server = app.listen(3000);