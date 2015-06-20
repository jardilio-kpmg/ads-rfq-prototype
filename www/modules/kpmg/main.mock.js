//this and all mock files are only included in bundle if mocks is enabled in build options
//mocks are enabled by default unless running a build with the --nomocks option
var main = require('./main');

main.requires.push('ngMockE2E');

angular.module('ngMockE2E').run(function ($httpBackend) {
    if (!('jasmin' in window)) {
        //let everything else without explicit when pass through after all other runs
        setTimeout(function () {
            $httpBackend.whenGET(/.+/).passThrough();
            $httpBackend.whenPOST(/.+/).passThrough();
            $httpBackend.whenPUT(/.+/).passThrough();
            $httpBackend.whenDELETE(/.+/).passThrough();
        });
    }
});
