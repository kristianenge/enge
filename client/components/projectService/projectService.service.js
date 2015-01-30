'use strict';

var projectService = angular.module('iengeWebApp')
  .service('projectService', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
   
  });
projectService.factory('ProjectFactory', function ($resource) {
    return $resource('/api/projects/:id', {
      id: '@_id'
    }, {
        show: { method: 'GET' },
        update: { method: 'PUT', params: {id: '@_id'} },
        delete: { method: 'DELETE', params: {id: '@_id'} }
    });
});

projectService.factory('ProjectsFactory', function ($resource) {
    return $resource('/api/projects', {
    }, {
        query: { method: 'GET', isArray: true },
        create: { method: 'POST' }
    });
});