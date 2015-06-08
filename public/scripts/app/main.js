'use strict';

angular.module('hubotScripts', [
    'ngRoute',
    'ngResource',
    'ngAnimate',
    'hubotScripts.controllers',
    'hubotScripts.resources',
    'hubotScripts.constants',
    'hubotScripts.services',
    'hubotScripts.directives',
    'hubotScripts.filters'
])

    // This limits Angular animations to elements that begin
    // with the classname 'ng-animate-'
    .config(['$animateProvider', function($animateProvider) {
        $animateProvider.classNameFilter(/ng-animate-/);
    }])

    .run([function() {
        // Whatever stuff you want to do when the app starts.
    }])
;

angular.module('hubotScripts.constants', []);

angular.module('hubotScripts.directives', []);

angular.module('hubotScripts.filters', []);

angular.module('hubotScripts.resources', []);

angular.module('hubotScripts.services', []);

angular.module('hubotScripts.controllers', []);