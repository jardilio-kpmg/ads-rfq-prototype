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

    it('should properly construct getData request without optionals', function () {
        var error = window.jasmine.createSpy('error');
        var success = window.jasmine.createSpy('success');

        service.expect.getData('testParam1','testParam2');
        service.getData('testParam1','testParam2').success(success).error(error);
        $httpBackend.flush();

        expect(error).not.toHaveBeenCalled();
        expect(success).toHaveBeenCalled();
    });

    it('should properly construct getData request with optionals', function () {
        var error = window.jasmine.createSpy('error');
        var success = window.jasmine.createSpy('success');

        service.expect.getData('testParam1','testParam2', {optional1: 'testParam3'});
        service.getData('testParam1','testParam2', {optional1: 'testParam3'}).success(success).error(error);
        $httpBackend.flush();

        expect(error).not.toHaveBeenCalled();
        expect(success).toHaveBeenCalled();
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});

angular.module('<%= scaffold.module %>').config(function ($provide) {



    $provide.decorator('<%= headlessCamelCase(scaffold.name) %>', function ($delegate, $httpBackend) {
        /**
         * This is allows us to decorate our service during unit tests with expectations
         * that can then be shared across all spec files. Not only will we need to set expectionations
         * on this service, but also in any dependency chains. If a controller references this service, we
         * need to set the expectations that the service will be called. Likewise if that controller is
         * defined in a directive and that directive in a view, we need to set these expectation there as well.
         * @class <%= headlessCamelCase(scaffold.module) %>.services.<%= headlessCamelCase(scaffold.name) %>.expect
         * @extends <%= headlessCamelCase(scaffold.module) %>.services.<%= headlessCamelCase(scaffold.name) %>
         */
        $delegate.expect = {
            getData: function (required1, required2, optionals) {
                var params = angular.extend({}, optionals, {
                    required1: required1,
                    required2: required2
                });
                $httpBackend.expectGET('/<%= hyphenCase(scaffold.module) %>/<%= hyphenCase(scaffold.name) %>/data?' + $.param(params)).respond();
            }
        };

        return $delegate;
    });
});
