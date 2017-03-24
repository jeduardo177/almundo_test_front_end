'use strict';

angular.module('myApp.view1', ['ngRoute', 'ngResource'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope','Hotels',
    function($scope, Hotels) {
    $scope.gethotels = function () {
        console.log("estoy aqui");
        var hotels = Hotels.query();
        console.log("Hoteles: ", hotels);
    }


}])

.factory('Hotels', ['$resource', function($resource) {
    return $resource('http://localhost:3000/hotels', null,
        {
            'update': { method:'PUT' }
        });
}]);