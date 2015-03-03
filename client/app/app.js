'use strict';

angular.module('iengeWebApp', [
  'ngCookies',
  'ngResource',
  'btford.markdown',
  'ngSanitize',
  'ngRoute',
  'btford.socket-io',
  'ui.bootstrap',
  'btford.markdown'

])
  .config(function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  }).factory('uuid2', [
            function() {
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
                }

                return {

                    newuuid: function() {
                        // http://www.ietf.org/rfc/rfc4122.txt
                        var s = [];
                        var hexDigits = '0123456789abcdef';
                        for (var i = 0; i < 36; i++) {
                            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
                        }
                        s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
                        s[19] = hexDigits.substr((s[19] && 0x3) || 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
                        s[8] = s[13] = s[18] = s[23] = '-';
                        return s.join('');
                    },
                    newguid: function() {
                        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                            s4() + '-' + s4() + s4() + s4();
                    }
                };
            
        }])

  .run(function ($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$routeChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  });