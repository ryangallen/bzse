var bzseControllers = angular.module('bzseControllers', ['ngCookies']);

bzseControllers.controller('BZSEController', [
    '$scope',
    '$cookieStore',
    'ngToast',
    'BZSEFactory',
    function($scope, $cookieStore, ngToast, BZSEFactory){
        $scope.initialCash = 100000;
        $scope.resetBZSE = function(){
            $scope.bzse = {
                cash: $scope.initialCash,
                portfolio: [],
            };
        }

        $scope.bzse = $cookieStore.get('bzse');
        if (!$scope.bzse){$scope.resetBZSE()}

        $scope.$watch('bzse', function(newValue, oldValue) {
            if (newValue != oldValue){$cookieStore.put('bzse', $scope.bzse)}
        }, true);

        var getPortfolioItem = function(symbol){
            return _.findWhere($scope.bzse.portfolio, {symbol: symbol});
        }

        $scope.getSymbolData = function(symbols){
            if (!symbols) return;
            var cleanSymbols = symbols.replace(/ /g,'').toUpperCase();
            $scope.bzse.symbols.arr = _.compact(cleanSymbols.split(','));

            var addAdditionalProperties = function(list){
                _.each(list, function(item, i){
                    item.symbol = $scope.bzse.symbols.arr[i];
                    item.quantity = 0;
                    item.portfolio = getPortfolioItem(item.symbol);
                });
            }

            var tailorData = function(data){
                var symbolData = _.values(data);
                addAdditionalProperties(symbolData);
                $scope.bzse.symbols.data =
                    _.reject(symbolData, function(item){return item.error});
                $scope.bzse.symbols.errors =
                    _.filter(symbolData, function(item){return item.error});
            }

            // BZSEFactory.getSymbolData(cleanSymbols).then(
            //     function(promise){tailorData(promise.data)},
            //     function(){
                    BZSEFactory.getMockSymbolData($scope.bzse.symbols.arr).then(
                        function(mockData){tailorData(mockData)}
                    );
            //     }
            // );
        }

        $scope.buyStock = function(data){
            var cost = (data.askPrice * data.quantity).toFixed(2);
            if (cost < $scope.bzse.cash){
                var portfolioItem = getPortfolioItem(data.symbol);
                if (portfolioItem){
                    portfolioItem.priceLastPaid = data.askPrice;
                    portfolioItem.qtyLastPurchased = data.quantity,
                    portfolioItem.quantity += data.quantity;
                } else {
                    portfolioItem = {
                        name: data.name,
                        symbol: data.symbol,
                        priceLastPaid: data.askPrice,
                        qtyLastPurchased: data.quantity,
                        quantity: data.quantity,
                    }
                    $scope.bzse.portfolio.push(portfolioItem);
                }

                _.findWhere(
                    $scope.bzse.symbols.data, {symbol: data.symbol}
                ).portfolio = portfolioItem;

                $scope.bzse.cash -= cost;

                ngToast.create('Successfully bought ' + data.quantity + ' ' +
                               data.name + ' stocks for $' + cost + '.');
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

        $scope.viewCurrent = function(symbol){
            $scope.getSymbolData(symbol)
        }
    }
]);
