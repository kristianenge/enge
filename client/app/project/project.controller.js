'use strict';

var app =angular.module('iengeWebApp');

app.controller('ProjectCtrl', function ($scope,$routeParams,$location,ProjectFactory) {
    $scope.isUpdate= function(){return true;};
    $scope.isCreate=function(){return false;};
    $scope.project = ProjectFactory.show({id: $routeParams.id});
    

    $scope.updateProject = function () {
        console.log('updateProject:'+$scope.project);
        ProjectFactory.update($scope.project);
        $location.path('/projects');
    };
    // callback for ng-click 'cancel':
    $scope.cancel = function () {
        $location.path('/projects');
    };
  });
app.controller('ProjectCreationCtrl', function ($scope,$location,ProjectsFactory) {
    $scope.isCreate=function(){return true;};
    $scope.isUpdate=function(){return false;};


    // callback for ng-click 'createNewProject':
    $scope.addProject = function () {
        ProjectsFactory.create($scope.project);
        $location.path('/projects');
    };
});
app.controller('ProjectViewCtrl', function ($scope,$routeParams,$location,ProjectFactory) {
    $scope.isCreate=function(){return true;};
    $scope.isUpdate=function(){return false;};
    $scope.project = ProjectFactory.show({id: $routeParams.id});

    $scope.back = function () {
        $location.path('/projects');
    };
});

app.directive('appFilereader', function(
    $q
  ) {
    /*
    made by elmerbulthuis@gmail.com WTFPL licensed
    */
    var slice = Array.prototype.slice;

    return {
      restrict: 'A',
      require: '?ngModel',
      link: function(scope, element, attrs, ngModel) {
        if (!ngModel) {return;}

        ngModel.$render = function() {};

        element.bind('change', function(e) {
          var element = e.target;
          if(!element.value){ return;}

          function readFile(file) {
            var deferred = $q.defer();

            var reader = new FileReader();
            reader.onload = function(e) {
              deferred.resolve(e.target.result);
            };
            reader.onerror = function(e) {
              deferred.reject(e);
            };
            reader.readAsDataURL(file);

            return deferred.promise;
          }

          element.disabled = true;
          $q.all(slice.call(element.files, 0).map(readFile))
            .then(function(values) {
              if (element.multiple) {ngModel.$setViewValue(values);}
              else {ngModel.$setViewValue(values.length ? values[0] : null);}
              element.value = null;
              element.disabled = false;
            });

          

        }); //change

      } //link

    }; //return

  }) //appFilereader
;