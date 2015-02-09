'use strict';

var imageService = angular.module('iengeWebApp')
  .service('image', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
  });

  imageService.factory('ImageFactory', function ($resource) {
    return $resource('/api/images/:id', {
      id: '@_id'
    }, {
        show: { method: 'GET' },
        update: { method: 'PUT', params: {id: '@_id'} },
        delete: { method: 'DELETE', params: {id: '@_id'} }
    });
});

imageService.factory('ImagesFactory', function ($resource) {
    return $resource('/api/images', {
    }, {
        query: { method: 'GET', isArray: true },
        create: { method: 'POST' }
    });
});
