var bzseControllers = angular.module('bzseControllers', ['ngCookies']);

bzseControllers.controller('BZSEController', [
    '$scope',
    '$cookieStore',
    'BZSEFactory',
    function($scope, $cookieStore, BZSEFactory){
        $scope.resetBZSE = function(){
            $cookieStore.remove('bzse');
        }

        $scope.bzse = $cookieStore.get('bzse');
        if (!$scope.bzse){
            $scope.bzse = {cash: 100000, portfolio: {}}
        }

        $scope.$watch('bzse', function(newValue, oldValue) {
            if (newValue != oldValue){$cookieStore.put('bzse', $scope.bzse)}
        }, true);

        $scope.getSymbolData = function(symbols){
            symbols = symbols.replace(/ /g,'');
            var symbolList = symbols.toUpperCase().split(',');

            var ensureSymbolProperty = function(list, symbols){
                _.each(list, function(item, i){item.symbol = symbols[i]})
            }
            var filterData = function(list){
                return _.reject(list, function(item){return item.error})
            }
            var filterErrors = function(list){
                return _.filter(list, function(item){return item.error})
            }

            var tailorData = function(data){
                var symbolData = _.values(data);
                ensureSymbolProperty(symbolData, symbolList);
                $scope.symbolData = filterData(symbolData);
                $scope.symbolErrors = filterErrors(symbolData);
            }

            // BZSEFactory.getSymbolData(symbols).then(
            //     function(promise){
            //         tailorData(promise.data)
            //     },
            //     function(){
                    BZSEFactory.getMockSymbolData().then(function(promise){
                        var mockData = {};
                        _.each(symbolList, function(symbol){
                            if (promise.data[symbol]){
                                mockData[symbol] = promise.data[symbol];
                            } else {
                                mockData[symbol] = {
                                    "error": {"code": 2, "message": "Symbol data not available."},
                                };
                            }
                        });
                        tailorData(mockData);
                    });
            //     }
            // );
        }
    }
]);
