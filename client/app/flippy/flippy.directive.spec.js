'use strict';

describe('Directive: flippy', function () {

  // load the directive's module
  beforeEach(module('iengeWebApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<flippy></flippy>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('');
    
  }));
});