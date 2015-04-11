var bzseApp = angular.module('bzseApp', [
    'ngResource',
    'bzseControllers',
    'bzseDirectives',
    'bzseServices'
]);

bzseApp.config([
    '$interpolateProvider',
    '$resourceProvider',
    function($interpolateProvider, $resourceProvider){
        $interpolateProvider.startSymbol('[[').endSymbol(']]');
        $resourceProvider.defaults.stripTrailingSlashes = false;
    }
]);
