'use strict';


var Router = require('falcor-router');
var Promise = require('promise');

var jsonGraph = require('falcor-json-graph');
var $ref = jsonGraph.ref;
var $error = jsonGraph.error;

var imdbService = require('./imdb-service');


var ImdbRouterBase = Router.createClass([
   {
        route: "lastMovie['title', 'director', 'image']",
        get: function(pathSet) {
            if (this.jsonMovies == undefined)
                throw new Error("no movies defined");
                    
            return imdbService.getByTitle(this.jsonMovies.lastMovie).
                then(function(movie) {
                    console.log(movie);
                    return pathSet[1].map(function(key) {
                        return { path: ["lastMovie", key], value: movie[key] };
                    });   
            });
        }
    },


    {
        route: "moviesById[{keys:id}]['title', 'director', 'id', 'image']",
        get: function(pathSet) {
            if (this.jsonMovies == undefined)
                throw new Error("no movies defined");
            var allMovies = this.jsonMovies.fordMovies.concat(this.jsonMovies.stalloneMovies);
     
             return imdbService.getMoviesByTitles(allMovies).
                then(function(movies) {
                    var results = [];
                    movies.forEach(function(movie) {
                        pathSet[2].forEach(function(key) {
                            
                            if (movie.error) {
                                results.push({
                                    path: ['moviesById', movie.id, key],
                                    value: $error(movie.error)
                                });
                            } else if (movie) {
                                results.push({
                                    path: ['moviesById', movie.id, key], 
                                    value: movie[key]
                                });
                            } else {
                                results.push({
                                    path: ['moviesById', movie.id],
                                    value: undefined
                                });
                            }
                             
                        });
                    });
                    return results;
                });
        }
    },

    {
        route: "fordMovies[{integers:indices}]",
        get: function(pathSet) {
           if (this.jsonMovies == undefined)
                throw new Error("no movies defined");

             return imdbService.getMoviesByTitles(this.jsonMovies.fordMovies).
                then(function(movies) {
                    var results = [];
                    pathSet.indices.forEach(function (index) {
                        var movie = movies[index];
                        results.push({
                            path: ['fordMovies', index], 
                            value: $ref(['moviesById', movie.id])
                        });
                    });
                    return results;
                });
        }
    },
    {
        route: "stalloneMovies[{integers:indices}]",
        get: function(pathSet) {
           if (this.jsonMovies == undefined)
                throw new Error("no movies defined");

             return imdbService.getMoviesByTitles(this.jsonMovies.stalloneMovies).
                then(function(movies) {
                    var results = [];
                    pathSet.indices.forEach(function (index) {
                        var movie = movies[index];
                        results.push({
                            path: ['stalloneMovies', index], 
                            value: $ref(['moviesById', movie.id])
                        });
                    });
                    return results;
                });
        }
    },
    {
        route: "movies.length",
        get: function(pathSet) {
            var allMovies = this.jsonMovies.fordMovies.concat(this.jsonMovies.stalloneMovies);
             return imdbService.getMoviesByTitles(allMovies).
                then(function(movies) {
                    return {path: ['movies','length'], 
                            value: movies.length };
                });
        }
        
    }
]);


var ImdbRouter = function(jsonMovies) {
    ImdbRouterBase.call(this);
    this.jsonMovies = jsonMovies;
};
ImdbRouter.prototype = Object.create(ImdbRouterBase.prototype);

module.exports = function(jsonMovies) {
    return new ImdbRouter(jsonMovies);    
};



