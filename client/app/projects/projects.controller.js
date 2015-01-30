'use strict';

angular.module('iengeWebApp')
  .controller('ProjectsCtrl', function ($scope, $http, $location, Auth, socket) {
    
     

    
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.projects = [];

    $http.get('/api/projects').success(function(projects) {
      $scope.projects = projects;
      socket.syncUpdates('project', $scope.projects);
      
    });

    $scope.viewProject = function (project) {
      console.log('going to /project/'+project._id);
      $location.path('/projectView/'+project._id);
    };

    $scope.editProject = function (project) {
      console.log('going to /project/'+project._id);
      $location.path('/project/'+project._id);
    };

    $scope.addProject = function() {
      console.log('going to /project');
      $location.path('/projectCreate');
    };

    $scope.deleteProject= function(project) {
      $http.delete('/api/projects/' + project._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('project');
    });
  });