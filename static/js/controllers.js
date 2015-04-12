var bzseControllers = angular.module('bzseControllers', ['ngCookies']);

bzseControllers.controller('BZSEController', [
    '$scope',
    '$cookieStore',
    'BZSEFactory',
    function($scope, $cookieStore, BZSEFactory){
        $scope.resetBZSE = function(){
            $scope.bzse = {cash: 100000, portfolio: []};
        }

        $scope.bzse = $cookieStore.get('bzse');
        if (!$scope.bzse){$scope.resetBZSE()}

        $scope.$watch('bzse', function(newValue, oldValue) {
            if (newValue != oldValue){$cookieStore.put('bzse', $scope.bzse)}
        }, true);

        $scope.getSymbolData = function(symbols){
            if (!symbols) return;
            symbols = symbols.replace(/ /g,'');
            var symbolArray = symbols.toUpperCase().split(',');

            var ensureSymbolProperty = function(list, symbols){
                _.each(list, function(item, i){item.symbol = symbols[i]})
            }

            var tailorData = function(data){
                var symbolData = _.values(data);
                ensureSymbolProperty(symbolData, symbolArray);
                $scope.bzse.symbols.data =
                    _.reject(symbolData, function(item){return item.error});
                $scope.bzse.symbols.errors =
                    _.filter(symbolData, function(item){return item.error});
            }

            // BZSEFactory.getSymbolData(symbols).then(
            //     function(promise){tailorData(promise.data)},
            //     function(){
                    BZSEFactory.getMockSymbolData(symbolArray).then(
                        function(mockData){tailorData(mockData)}
                    );
            //     }
            // );
        }
    }
]);
