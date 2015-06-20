describe('<%= scaffold.module %>/factories/<%= scaffold.name %>.js', function () {



    /**
     * $httpBackend is used to flush http requests which may be linked thru
     * services in your controller to be performed synchronously.
     *
     * @see http://docs.angularjs.org/api/ngMock.$httpBackend
     * @see http://docs.angularjs.org/api/ngMockE2E.$httpBackend
     * @type {ng.$httpBackend}
     */
    var $httpBackend;

    /**
     * @type {function}
     */
    var FactoryCtor, FactoryCtor2;

    /**
     * @type {<%= headlessCamelCase(scaffold.module) %>.factories.<%= camelCase(scaffold.name) %>}
     */
    var factoryInstance, factoryInstance2;

    beforeEach(angular.mock.module('ngMock','<%= headlessCamelCase(scaffold.module) %>'));

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        FactoryCtor = $injector.get('<%= camelCase(scaffold.name) %>');
        FactoryCtor2 = $injector.get('<%= camelCase(scaffold.name) %>');
        factoryInstance = new FactoryCtor();
        factoryInstance2 = new FactoryCtor2();
        $httpBackend.resetExpectations();
    }));

    it('should be defined in module', function () {
        expect(FactoryCtor).toBeDefined();
    });

    it('should be a singleton (constructor)', function () {
        expect(FactoryCtor).toBe(FactoryCtor2);
    });

    it('should not be a singleton (instance)', function () {
        expect(factoryInstance).not.toBe(factoryInstance2);
    });

    //TODO: write your unit tests for <%= scaffold.name %>

    it('should return proper name value', function () {
        expect(factoryInstance.getName()).toBe('<%= scaffold.name %>');
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
