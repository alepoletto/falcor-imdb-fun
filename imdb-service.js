var rp = require('request-promise');
var q = require('q');

var url = 'http://www.omdbapi.com/';

function ImdbService() {

var service = {
    getByTitle: getByTitle,
    getMoviesByTitles: function(titles) {
      var tasks = [];
      titles.forEach(function(title){
        tasks.push(getByTitle(title));
      })
      return q.all(tasks).then(function(result){
        return result;
      })
       
    }
  }


   function getByTitle(title) {
     return rp({
                uri: url,
                qs: { t: title,
                      plot: 'short',
                      r:'json'},
                useQuerystring: true,
                method: "GET"
              })
            .then(function(response) {
              var json = JSON.parse(response);
                return { title: json.Title,
                        director: json.Director,
                        id: json.imdbID,
                        image: json.Poster
                      }
            }); 
    };


    return service;

}

module.exports = new ImdbService();
