'use strict';

describe('Controller: ProjectsCtrl', function () {

  // load the controller's module
  beforeEach(module('iengeWebApp'));
  beforeEach(module('socketMock'));

  var ProjectsCtrl, scope,$httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/projects')
      .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);

    scope = $rootScope.$new();
    ProjectsCtrl = $controller('ProjectsCtrl', {
      $scope: scope
    });
  }));

  
  it('should attach a list of projects to the scope', function () {
    $httpBackend.flush();
    expect(scope.projects.length).toBe(4);
  });
});
