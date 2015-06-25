/**
 * @see https://docs.angularjs.org/api/ngMockE2E
 */
angular.module('ngMockE2E').run(function (/**ngMockE2E.$httpBackend*/ $httpBackend) {



    //TODO: register expects and/or when conditions for factualUpcService http service

    $httpBackend.whenGET(new RegExp('/factual/factual-upc-service/data')).respond(
        function (method, url, data) {
            data = {
                name: 'factualUpcService'
            };
            return [200, data];
        }
    );

});
