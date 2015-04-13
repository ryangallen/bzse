var bzseServices = angular.module('bzseServices', ['ngResource'])
var bzseAPI = "http://careers-data.benzinga.com/rest/richquote/"

bzseServices.factory('BZSEFactory', ['$http', '$q',
    function($http, $q){
        return {
            getSymbolData: function(symbols){
                return $http.get(bzseAPI, {params: {symbols: symbols}});
            },
            getMockSymbolData: function(symbols){
                var symbolArray = _.compact(symbols.split(','));
                return $q(function(resolve){
                    $http.get('/static/js/mock_data.json').then(
                        function(promise){
                            var mockData = {};
                            _.each(symbolArray, function(symbol){
                                if (promise.data[symbol]){
                                    mockData[symbol] = promise.data[symbol];
                                } else {
                                    mockData[symbol] = {
                                        "error": {
                                            "code": 2,
                                            "message": "Symbol data not available."
                                        },
                                    };
                                }
                            });
                            resolve(mockData);
                        }
                    );
                });
            },
        }
    }
]);
