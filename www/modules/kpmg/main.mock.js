//this and all mock files are only included in bundle if mocks is enabled in build options
//mocks are enabled by default unless running a build with the --nomocks option
var main = require('./main'),
    initialized = false;



//if *.mock.js files are included in bundle, push dependency on ngMockE2E
main.requires.push('ngMockE2E');
main.config(function ($provide, $httpProvider) {
    $provide.factory('ngMockE2EPassThrough', function initializeDefaultPassThrough($httpBackend) {
        return {
            request: function (config) {
                if (!initialized) {
                    initialized = true;
                    $httpBackend.whenGET(/.+/).passThrough();
                    $httpBackend.whenPOST(/.+/).passThrough();
                    $httpBackend.whenPUT(/.+/).passThrough();
                    $httpBackend.whenDELETE(/.+/).passThrough();
                }
                return config;
            }
        };
    });
    $httpProvider.interceptors.push('ngMockE2EPassThrough');
});
