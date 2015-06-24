describe('openfda/services/FoodEnforcementService.js', function () {



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
     * @type {openfda.services.foodEnforcementService}
     */
    var service, service2;

    beforeEach(angular.mock.module('ngMock','openfda'));

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        service = $injector.get('foodEnforcementService');
        service2 = $injector.get('foodEnforcementService');
        $httpBackend.resetExpectations();
    }));

    it('should be defined in module', function () {
        expect(service).toBeDefined();
    });

    it('should be a singleton', function () {
        expect(service).toBe(service2);
    });

    it('should properly construct getRecallsByBarcode request without options', function () {
        var error = window.jasmine.createSpy('error');
        var success = window.jasmine.createSpy('success');

        service.getRecallsByBarcode('111111111111').success(success).error(error);

        $httpBackend.expectGET('//api.fda.gov/food/enforcement.json?search=status:ongoing+AND+product_type:food+AND+code_info:111111111111&api_key=CGEoOaTA5x5mmrKoA677SU7hW6tLjR94l33eDGic&limit=30&skip=0').respond({});
        $httpBackend.flush();

        expect(error).not.toHaveBeenCalled();
        expect(success).toHaveBeenCalled();
    });

    it('should properly construct getRecallsByBarcode request with options', function () {
        var error = window.jasmine.createSpy('error');
        var success = window.jasmine.createSpy('success');

        service.getRecallsByBarcode('111111111111', {
            limit: 1,
            skip: 2,
            status: 4,
            server: 5,
            api_key: 6
        }).success(success).error(error);

        $httpBackend.expectGET('5/food/enforcement.json?search=status:4+AND+product_type:food+AND+code_info:111111111111&api_key=6&limit=1&skip=2').respond({});
        $httpBackend.flush();

        expect(error).not.toHaveBeenCalled();
        expect(success).toHaveBeenCalled();
    });

    it('should properly construct getRecallsByKeyword request without options', function () {
        var error = window.jasmine.createSpy('error');
        var success = window.jasmine.createSpy('success');

        service.getRecallsByKeyword('111 222 333').success(success).error(error);

        $httpBackend.expectGET('//api.fda.gov/food/enforcement.json?search=status:ongoing+AND+product_type:food+AND+product_description:111+222+333&api_key=CGEoOaTA5x5mmrKoA677SU7hW6tLjR94l33eDGic&limit=30&skip=0').respond({});
        $httpBackend.flush();

        expect(error).not.toHaveBeenCalled();
        expect(success).toHaveBeenCalled();
    });

    it('should properly construct getRecallsByKeyword request with options', function () {
        var error = window.jasmine.createSpy('error');
        var success = window.jasmine.createSpy('success');

        service.getRecallsByKeyword('111 222 333', {
            limit: 1,
            skip: 2,
            status: 4,
            server: 5,
            api_key: 6
        }).success(success).error(error);

        $httpBackend.expectGET('5/food/enforcement.json?search=status:4+AND+product_type:food+AND+product_description:111+222+333&api_key=6&limit=1&skip=2').respond({});
        $httpBackend.flush();

        expect(error).not.toHaveBeenCalled();
        expect(success).toHaveBeenCalled();
    });

    it('should properly construct getRecallById request', function () {
        var error = window.jasmine.createSpy('error');
        var success = window.jasmine.createSpy('success');

        service.getRecallById('88888888').success(success).error(error);

        $httpBackend.expectGET('//api.fda.gov/food/enforcement.json?search=recall_number:88888888&api_key=CGEoOaTA5x5mmrKoA677SU7hW6tLjR94l33eDGic&limit=1&skip=0').respond({});
        $httpBackend.flush();

        expect(error).not.toHaveBeenCalled();
        expect(success).toHaveBeenCalled();
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
