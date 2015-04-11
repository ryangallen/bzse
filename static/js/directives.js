var bzseDirectives = angular.module('bzseDirectives', [])

bzseDirectives
    .directive('loading', ['$http', function($http){
        return {
            restrict: 'A',
            link: function (scope, elm, attrs){
                scope.isLoading = function(){
                    return $http.pendingRequests.length > 0;
                };
                scope.$watch(scope.isLoading, function(v){
                    v ? elm.show() : elm.hide();
                });
            }
        };
    }])
    .directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                    scope.$apply(function(){
                        scope.$eval(attrs.ngEnter, {'event': event});
                    });
                    event.preventDefault();
                }
            });
        };
    });

