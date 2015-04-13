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

            var addAdditionalProperties = function(list){
                _.each(list, function(item, i){
                    item.quantity = 0;
                    item.portfolio = getPortfolioItem(item.symbol);
                });
            }

            var tailorData = function(data){
                for (var s in data){data[s].symbol = s}
                var symbolData = _.values(data);

                $scope.bzse.symbols.data =
                    _.reject(symbolData, function(item){return item.error});
                $scope.bzse.symbols.errors =
                    _.filter(symbolData, function(item){return item.error});

                addAdditionalProperties($scope.bzse.symbols.data);
            }

            var cleanSymbols = symbols.replace(/ /g,'').toUpperCase();
            // BZSEFactory.getSymbolData(cleanSymbols).then(
            //     function(promise){tailorData(promise.data)},
            //     function(){
                    BZSEFactory.getMockSymbolData(cleanSymbols).then(
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
                    portfolioItem.priceLastPurchased = data.askPrice;
                    portfolioItem.qtyLastPurchased = data.quantity;
                    portfolioItem.quantity += data.quantity;
                } else {
                    portfolioItem = {
                        name: data.name,
                        symbol: data.symbol,
                        priceLastPurchased: data.askPrice,
                        qtyLastPurchased: data.quantity,
                        quantity: data.quantity,
                    }
                    $scope.bzse.portfolio.push(portfolioItem);
                }

                _.findWhere(
                    $scope.bzse.symbols.data, {symbol: data.symbol}
                ).portfolio = portfolioItem;

                $scope.bzse.cash -= parseFloat(cost);
                ngToast.create('Bought ' + data.quantity + ' ' +
                               data.name + ' stocks for $' + cost + '.');
            } else {
                ngToast.create({
                    className: 'danger',
                    content: 'You cannot afford to buy ' + data.quantity + ' ' +
                              data.name + ' stocks.'
                });
            }
        }

        $scope.sellStock = function(data){
            var portfolioItem = getPortfolioItem(data.symbol);
            if (portfolioItem && portfolioItem.quantity >= data.quantity){
                portfolioItem.priceLastSold = data.bidPrice;
                portfolioItem.qtyLastSold = data.quantity;
                portfolioItem.quantity -= data.quantity;

                _.findWhere(
                    $scope.bzse.symbols.data, {symbol: data.symbol}
                ).portfolio = portfolioItem;

                var earning = (data.bidPrice * data.quantity).toFixed(2);
                $scope.bzse.cash += parseFloat(earning);
                ngToast.create('Sold ' + data.quantity + ' ' +
                               data.name + ' stocks for $' + earning + '.');

            } else {
                ngToast.create({
                    className: 'danger',
                    content: 'You do not have ' + data.quantity + ' ' +
                              data.name + ' stocks to sell.'
                });
            }
        }

        $scope.viewCurrent = function(symbol){
            $scope.getSymbolData(symbol)
        }
    }
]);
