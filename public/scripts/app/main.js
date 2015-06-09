'use strict';

angular.module('hubotScripts', [
    'ngResource',
    'ngAnimate',
    'angularMoment'
])

    // This limits Angular animations to elements that begin
    // with the classname 'ng-animate-'
    .config(['$animateProvider', function($animateProvider) {
        $animateProvider.classNameFilter(/ng-animate-/);
    }])

    .run([function() {
        // Whatever stuff you want to do when the app starts.
    }])

    .service('PackageService', function($http, $q) {
        return {
            cacheLocation: 'cache.json',
            metadata: {},
            packages: {},
            get: function() {
                var that = this;
                var deferred = $q.defer();
                $http.get(that.cacheLocation).then(function(response) {
                    that.metadata = response.data.meta || {};
                    that.packages = response.data.packages || {};
                    deferred.resolve(that.packages);
                });
                return deferred.promise;
            }
        };
    })

    .controller('MainController', function($scope, PackageService) {
        PackageService.get();
        $scope.packageService = PackageService;
    })
;