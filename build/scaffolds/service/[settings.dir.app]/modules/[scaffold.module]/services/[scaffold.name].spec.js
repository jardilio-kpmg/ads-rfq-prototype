describe('<%= scaffold.module %>/services/<%= scaffold.name %>.js', function () {



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
     * @type {<%= headlessCamelCase(scaffold.module) %>.services.<%= headlessCamelCase(scaffold.name) %>}
     */
    var service, service2;

    beforeEach(angular.mock.module('ngMock','<%= headlessCamelCase(scaffold.module) %>'));

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        service = $injector.get('<%= headlessCamelCase(scaffold.name) %>');
        service2 = $injector.get('<%= headlessCamelCase(scaffold.name) %>');
        $httpBackend.resetExpectations();
    }));

    it('should be defined in module', function () {
        expect(service).toBeDefined();
    });

    it('should be a singleton', function () {
        expect(service).toBe(service2);
    });

    //TODO: write your unit tests for <%= scaffold.name %>

    it('should return proper name value', function () {
        expect(service.getName()).toBe('<%= scaffold.name %>');
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
