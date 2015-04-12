var bzseApp = angular.module('bzseApp', [
    'ngResource',
    'ngToast',
    'bzseControllers',
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
