'use strict';

angular.module('iengeWebApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/project/:id', {
        templateUrl: 'app/project/project.html',
        controller: 'ProjectCtrl'
      })
      .when('/projectView/:id', {
        templateUrl: 'app/project/projectView.html',
        controller: 'ProjectViewCtrl'
      })
      .when('/projectCreate', {
        templateUrl: 'app/project/project.html',
        controller: 'ProjectCreationCtrl'
      });
  });
