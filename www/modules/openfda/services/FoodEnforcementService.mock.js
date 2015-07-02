/**
 * @see https://docs.angularjs.org/api/ngMockE2E
 */
angular.module('ngMockE2E').run(function (/**ngMockE2E.$httpBackend*/ $httpBackend) {



    //TODO: register expects and/or when conditions for FoodEnforcementService http service

    $httpBackend.whenGET(new RegExp('/openfda/food-enforcement-service/data')).respond(
        function (method, url, data) {
            data = {
                name: 'FoodEnforcementService'
            };
            return [200, data];
        }
    );

});
