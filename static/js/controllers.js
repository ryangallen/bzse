var bzseControllers = angular.module('bzseControllers', ['ngCookies']);

bzseControllers.controller('BZSEController', [
    '$scope',
    '$cookieStore',
    'ngToast',
    'BZSEFactory',
    function($scope, $cookieStore, ngToast, BZSEFactory){
        $scope.initialCash = 100000;
        $scope.resetBZSE = function(){
            $scope.bzse = {cash: $scope.initialCash, portfolio: []};
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

            var addAdditionalProperties = function(list, symbols){
                _.each(list, function(item, i){
                    item.symbol = symbols[i];
                    item.quantity = 0;
                    item.portfolio = _.findWhere(
                        $scope.bzse.portfolio, {symbol: item.symbol}
                    );
                })
            }

            var tailorData = function(data){
                var symbolData = _.values(data);
                addAdditionalProperties(symbolData, symbolArray);
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

        $scope.buyStock = function(data){
            var cost = data.askPrice * data.quantity;
            if (cost < $scope.bzse.cash){
                $scope.bzse.portfolio.push({
                    name: data.name,
                    symbol: data.symbol,
                    quantity: data.quantity,
                    pricePaid: data.askPrice,
                });
                $scope.bzse.cash -= cost;
                ngToast.create('Successfully bought ' + data.quantity + ' ' +
                               data.symbol + ' stocks for $' + cost + '.');
            } else {
                ngToast.create({
                    className: 'danger',
                    content: 'You cannot afford to buy that many.'
                });
            }
        }

        $scope.sellStock = function(data){
            console.log('selling');
        }
    }
]);
