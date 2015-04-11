var bzseControllers = angular.module('bzseControllers', []);

bzseControllers.controller('BZSEController', [
    '$scope',
    'BZSEFactory',
    function($scope, BZSEFactory){
        var symbols = "F,DOGG";
        // BZSEFactory.getSymbolData(symbols).then(
        //     function(promise){
        //         $scope.symbolData = _.values(promise.data);
        //     },
        //     function(e){
                BZSEFactory.getMockSymbolData(symbols).then(function(promise){
                    var mockData = {};
                    _.each(symbols.split(','), function(symbol){
                        if (promise.data[symbol]){
                            mockData[symbol] = promise.data[symbol];
                        } else {
                            mockData[symbol] = {
                                "error": {"code": 2, "message": "Symbol data not available."}
                            };
                        }
                    });
                    $scope.symbolData = _.values(mockData);
                });
        //     }
        // );
    }
]);
