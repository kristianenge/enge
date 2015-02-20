'use strict';

var app =angular.module('iengeWebApp')

.config(['$compileProvider', function($compileProvider) {   
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data|blob|chrome-extension):/);
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|data|blob|chrome-extension):/);
}])
;


app.controller('ProjectCtrl', function ($scope,$routeParams,$location,ImagesFactory,ImageFactory,ProjectFactory,uuid2,$http) {
    $scope.isUpdate= function(){return true;};
    $scope.isCreate=function(){return false;};
    
    $scope.coverimage = {_id:'',rawdata:''};
    $scope.config = {
      width: 600,
      height: 600,
      quality: 1,
      imageURL: '/api/images/'
    };

    var project = ProjectFactory.show({id: $routeParams.id}, function(project){
      console.log('proj:'+project.coverimage);
      var coverimage=project.coverimage;
      $scope.coverimage._id = coverimage;
      console.log('fetching pic: '+project.coverimage);
      

      $http.get('/api/images/'+coverimage+'/encoded').success(function(image) {
        $scope.coverimage.rawdata = image.rawdata;
      
      });
      var index =project.images.length;
      $scope.images =[];

      console.log('project.length:'+project.images.length);
      
      for(var i=0;i<index;i++){
        console.log('loop:'+i);
        getImage(project,i);
      }

    });
    $scope.project =project;
    
    var getImage = function(project,i){ $http.get('/api/images/'+project.images[i]+'/encoded').success(function(image) {
          console.log(image.rawdata);
          $scope.images.push(image.rawdata);
        });
    };

    $scope.updateProject = function () {
        
        console.log('updateProject:'+$scope.project);
        var project = $scope.project ;
        
        ImageFactory.delete({id: $scope.coverimage._id});
        $scope.coverimage._id = uuid2.newguid();
        ImagesFactory.create($scope.coverimage);
        $scope.project.coverimage = $scope.coverimage._id;
        
        var index =$scope.images;
        if($scope.images > 0 ){
          for(var i=0;i<index;i++){
            console.log('inside loop');
            if($scope.images[index] === null)
            {
              project.splice(index);
            }
            else{
              project.images[index] = uuid2.newguid();  
              ImagesFactory.create($scope.images);
            }
            
            
            project.images = $scope.images;
          }
        }
        else{
          console.log('not'+project.images);
          project.images = ['fewfwe:fmew'];
          console.log('not'+project.images);
        }

        ProjectFactory.update(project);
        $location.path('/projects');
    };
    // callback for ng-click 'cancel':
    $scope.cancel = function () {
        $location.path('/projects');
    };
  });

app.controller('ProjectCreationCtrl', function ($scope,$location,ProjectsFactory,ImagesFactory,uuid2) {
    $scope.isCreate=function(){return true;};
    $scope.isUpdate=function(){return false;};
    $scope.config = {
      width: 600,
      height: 600,
      quality: 1
    };
    $scope.images = [];


    // callback for ng-click 'createNewProject':
    $scope.addProject = function () {
      
      if($scope.coverimage){
        $scope.coverimage._id = uuid2.newguid();
        ImagesFactory.create($scope.coverimage);
        console.log($scope.coverimage.rawdata+' , '+$scope.coverimage._id);
        $scope.project.coverimage = $scope.coverimage._id;
      }
      if($scope.images){
        var arrayLength =$scope.images.length;
        console.log('length of image array: '+arrayLength);
        $scope.project.images = new Array(arrayLength);
        var tmpImgArray = new Array(arrayLength);
         for(var i=0;i<arrayLength;i++){
            var uuid= uuid2.newguid();
            tmpImgArray[i] ={_id:uuid,rawdata:$scope.images[i]};
            console.log('inside loop, length:'+ arrayLength+', i:'+i);
            
            console.log($scope.images.length+' , '+tmpImgArray[i].rawdata+' , '+tmpImgArray[i]._uid);
            ImagesFactory.create(tmpImgArray[i]);
            $scope.project.images[i] = tmpImgArray[i]._id;
          }
      }
      
      ProjectsFactory.create($scope.project);
      $location.path('/projects');
    
       
    };
});

app.controller('ProjectViewCtrl', function ($scope,$routeParams,$location,ProjectFactory,$http) {
    $scope.isCreate=function(){return true;};
    $scope.isUpdate=function(){return false;};
    $scope.project = ProjectFactory.show({id: $routeParams.id});
    $scope.coverimage = {_id:'',rawdata:''};
    $scope.config = {
      width: 600,
      height: 600,
      quality: 1,
      imageURL: '/api/images/'
    };

    var project = ProjectFactory.show({id: $routeParams.id}, function(project){
      console.log('proj:'+project.coverimage);
      var coverimage=project.coverimage;
      $scope.coverimage._id = coverimage;
      console.log('fetching pic: '+project.coverimage);
      

      $http.get('/api/images/'+coverimage+'/encoded').success(function(image) {
        $scope.coverimage.rawdata = image.rawdata;
      
      });
      var index =project.images.length;
      $scope.images =[];

      console.log('project.length:'+project.images.length);
      
      for(var i=0;i<index;i++){
        console.log('loop:'+i);
        getImage(project,i);
      }

    });
    $scope.project =project;
    
    var getImage = function(project,i){ $http.get('/api/images/'+project.images[i]+'/encoded').success(function(image) {
          console.log(image.rawdata);
          $scope.images.push(image.rawdata);
        });
    };

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
              
              
              if (element.multiple && values.length > 1) {
              
                ngModel.$setViewValue(values);}
              else if (element.multiple && values.length ===1) {
                  
                  ngModel.$setViewValue(values[0]);
                }
              else {
                
                ngModel.$setViewValue(values.length ? values[0] : null);}
              element.value = null;
              element.disabled = false;
            });

          

        }); //change

      } //link

    }; //return

  }) //appFilereader
;