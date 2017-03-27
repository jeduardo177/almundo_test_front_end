'use strict';

angular.module('myApp.view1', ['ngRoute', 'ngResource', 'ngMaterial', 'jkAngularRatingStars', 'rzModule'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope','$resource','Hotels',
    function($scope, $resource, Hotels) {

        var min, max;
        minimo();

        //Obtengo el precio minimo de todos los hoteles
        function minimo() {
            var minPrice = $resource('http://localhost:3000/getHotelMinPrice');
            minPrice.get(function(hotel) {
                min = hotel.price;
                maximo();
            });
        }

        //Obtengo el precio maximo de todos los hoteles
        function maximo() {
            var maxPrice = $resource('http://localhost:3000/getHotelMaxPrice');
            maxPrice.get(function(hotel) {
                max = hotel.price;
                init();
            });
        }

        //Inicializo los la lista de hoteles y sus filtros
        function init() {
            $scope.hotels = Hotels.query();

            //Inicializo filtro slider para rango de precio
            $scope.slider = {
                minValue: min,
                maxValue: max,
                options: {
                    floor: min,
                    ceil: max,
                    translate: function(value) {
                        return '$' + value;
                    }
                }
            };

            //Inicializo El filtro para estrellas
            $scope.starts = [5,4,3,2,1];
            $scope.selected = [5,4,3,2,1];
            $scope.readOnly = true;
            $scope.onItemRating = function(rating){
                alert('On Rating: ' + rating);
            };

            $scope.toggle = function (start, list) {
                var idx = list.indexOf(start);
                if (idx > -1) {
                    list.splice(idx, 1);
                }
                else {
                    list.push(start);
                }
            };

            $scope.exists = function (start, list) {
                return list.indexOf(start) > -1;
            };

            $scope.isIndeterminate = function() {
                return ($scope.selected.length !== 0 &&
                $scope.selected.length !== $scope.starts.length);
            };

            $scope.isChecked = function() {
                return $scope.selected.length === $scope.starts.length;
            };

            $scope.toggleAll = function() {
                if ($scope.selected.length === $scope.starts.length) {
                    $scope.selected = [];
                } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
                    $scope.selected = $scope.starts.slice(0);
                }
            };
        }



}])

//Factory que para consumir web service que provee la lista de hoteles
.factory('Hotels', ['$resource', function($resource) {
    return $resource('http://localhost:3000/hotels', null,
        {
            'update': { method:'PUT' }
        });
}])

//Filtro por rango de precios
.filter('filterRangePrice', function() {
    return function(input, slider) {
        var hotels = [];
        angular.forEach(input, function(hotel) {
            if (hotel.price >= slider.minValue && hotel.price <= slider.maxValue) {
                hotels.push(hotel);
            }
        })
        return hotels;
    }
})

//Filtro por estrellas
    .filter('filterStart', function() {
        return function(input, selected) {
            var hotels = [];
            angular.forEach(selected, function (select) {
                angular.forEach(input, function(hotel) {
                    if (hotel.starts === select) {
                        hotels.push(hotel);
                    }
                })
            })
            return hotels;
        }
    });
