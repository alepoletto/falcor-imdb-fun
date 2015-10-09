(function (angular) {
  angular.module('app', [])
    .controller('mainController', mainController);

  mainController.$inject = ['$scope'];

  function mainController($scope) {


  	activate();


    $scope.search = function(){
       var model = new falcor.Model({source: new falcor.HttpDataSource('/model.json?title='+$scope.title) }).batch();
       model.
        get('lastMovie["title", "director", "image"]').
          then(function(response) {
            $scope.lastMovie = response.json.lastMovie;
            $scope.$evalAsync(); 
          });

    }

    function activate() {
      
      $scope.fordMovies = [];
      $scope.stalloneMovies = [];
      var model = new falcor.Model({source: new falcor.HttpDataSource('/model.json') }).batch();


      model.
        get('fordMovies[0..2]["title", "director", "image"]').
          then(function(response) {
            Object.keys(response.json.fordMovies).forEach(function(movie) {
              $scope.fordMovies.push(response.json.fordMovies[movie]);
            });
             $scope.$evalAsync(); 
          });
      

      model.
        get('stalloneMovies[0..2]["title", "director", "image"]').
          then(function(response) {
            console.log(response);
            Object.keys(response.json.stalloneMovies).forEach(function(movie) {
              $scope.stalloneMovies.push(response.json.stalloneMovies[movie]);
            });
             $scope.$evalAsync(); 
          });
    }

  }

})(angular);

