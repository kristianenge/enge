'use strict';

angular.module('iengeWebApp')
  .controller('ContactCtrl', function ($scope) {
    $scope.message = 'Hello';
    var spanWidth = $('#text span').width();

	$('#text').animate( { width: spanWidth }, 1000 , function() {
    // Animation complete.
    $('#details').removeClass('hidden');
  });
	
  });



