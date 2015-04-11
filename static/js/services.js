var bzseServices = angular.module('bzseServices', ['ngResource'])
var bzseAPI = "http://careers-data.benzinga.com/rest/richquote/"

bzseServices.factory('BZSEFactory', ['$http',
    function($http){
        return {
            getSymbolData: function(symbols){
                return $http.get(bzseAPI, {params: {symbols: symbols}});
            },
            getMockSymbolData: function(){
                return $http.get('/static/js/mock_data.json');
            },
        }
    }
]);
