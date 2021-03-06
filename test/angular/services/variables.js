'use strict';

describe('Service: Variables', function() {
  var socketEventListeners = {},
      Variables,
      styleguideMock,
      mockSocketService,
      rootScope;

  beforeEach(angular.mock.module('sgApp'));

  beforeEach(module(function($provide) {
    mockSocketService = {
      on: function(event, cb) {
        socketEventListeners[event] = cb;
      },
      emit: function(event, data, cb) {}
    };

    styleguideMock = {
      config: {
        data: {
          settings: {
            setting1: {value: 'value1', index: 0},
            setting2: {value: 'value2', index: 1}
          }
        }
      }
    };
    $provide.value('Styleguide', styleguideMock);
    $provide.value('Socket', mockSocketService);
  }));

  beforeEach(function() {
    inject(function(_Variables_, $rootScope) {
      rootScope = $rootScope;
      Variables = _Variables_;
    });
  });

  it('should get default values from Styleguide service', function() {
    rootScope.$digest();
    expect(Variables.variables).to.eql({
      setting1: {value: 'value1', index: 0},
      setting2: {value: 'value2', index: 1}
    });
  });

  it('should not mark server side changes as dirty', function() {
    rootScope.$digest();
    styleguideMock.config.data = {
      settings: {
        setting1: {value: 'new value1', index: 0},
        setting2: {value: 'new value2', index: 1}
      }
    };
    rootScope.$digest();
    expect(Variables.variables).to.eql({
      setting1: {value: 'new value1', index: 0},
      setting2: {value: 'new value2', index: 1}
    });
  });

  it('should change values properly and mark them as dirty', function() {
    rootScope.$digest();
    Variables.variables.setting1.value = 'changed';
    rootScope.$digest();
    expect(Variables.variables).to.eql({
      setting1: {value: 'changed', index: 0, dirty: true},
      setting2: {value: 'value2', index: 1}
    });
  });

  it('should remove dirty marking when variable is changed back', function() {
    rootScope.$digest();
    Variables.variables.setting1.value = 'changed';
    rootScope.$digest();
    Variables.variables.setting1.value = 'value1';
    rootScope.$digest();
    expect(Variables.variables).to.eql({
      setting1: {value: 'value1', index: 0},
      setting2: {value: 'value2', index: 1}
    });
  });

  it('should not lose local changes when updating server side data', function() {
    rootScope.$digest();
    Variables.variables.setting2.value = 'changed2';
    rootScope.$digest();
    styleguideMock.config.data = {
      settings: {
        setting1: {value: 'new value1', index: 0},
        setting2: {value: 'new value2', index: 1}
      }
    }
    rootScope.$digest();
    expect(Variables.variables).to.eql({
      setting1: {value: 'new value1', index: 0},
      setting2: {value: 'changed2', index: 1, dirty: true}
    });
  });

  it('should remove local values that does not exist on server side', function() {
    rootScope.$digest();
    styleguideMock.config.data = {
      settings: {
        setting2: {value: 'value2', index: 0}
      }
    };
    rootScope.$digest();
    expect(Variables.variables).to.eql({
      setting2: {value: 'value2', index: 0}
    });
  });

  it('should properly reset local changes', function() {
    rootScope.$digest();
    Variables.variables.setting1.value = 'changed1';
    Variables.variables.setting2.value = 'changed2';
    Variables.resetLocal();
    rootScope.$digest();
    expect(Variables.variables).to.eql({
      setting1: {value: 'value1', index: 0},
      setting2: {value: 'value2', index: 1}
    });
  });

  it('should allow new server side keys', function() {
    rootScope.$digest();
    styleguideMock.config.data = {
      settings: {
        setting1: {value: 'value1', index: 0},
        setting2: {value: 'value2', index: 1},
        setting3: {value: 'value3', index: 2}
      }
    };
    rootScope.$digest();
    expect(Variables.variables).to.eql({
      setting1: {value: 'value1', index: 0},
      setting2: {value: 'value2', index: 1},
      setting3: {value: 'value3', index: 2}
    });
  });

  it('should handle properly index changes without losing local changes', function() {
    rootScope.$digest();
    Variables.variables.setting1.value = 'new value1';
    Variables.variables.setting2.value = 'new value2';
    rootScope.$digest();
    styleguideMock.config.data = {
      settings: {
        setting1: {value: 'value1', index: 1},
        setting2: {value: 'value2', index: 0}
      }
    };
    rootScope.$digest();
    expect(Variables.variables).to.eql({
      setting1: {value: 'new value1', index: 1, dirty: true},
      setting2: {value: 'new value2', index: 0, dirty: true}
    });
  });

  describe('socket event listener', function() {

    var broadcastSpy,
        socketEventBroadcasts = {
          'styleguide progress start': ['progress start'],
          'styleguide progress end': ['progress end', 'styles changed']
        };

    beforeEach(function() {
      broadcastSpy = sinon.spy(rootScope, '$broadcast');
    });

    Object.keys(socketEventBroadcasts).forEach(function(socketEvent) {

      describe('for "' + socketEvent + '"', function() {

        it('is registered', function() {
          expect(socketEventListeners[socketEvent]).to.be.an('function');
        });

        socketEventBroadcasts[socketEvent].forEach(function(broadcastEvent) {

          it('should broadcast "' + broadcastEvent + '" via $rootScope', function() {
            socketEventListeners[socketEvent].call();
            expect(broadcastSpy).to.have.been.calledWith(broadcastEvent);
          });

        });

      });
    });

  });

});
