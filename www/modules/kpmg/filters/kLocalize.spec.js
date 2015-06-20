describe('kpmg/angular/filters/kLocalize.js', function () {
    /**
     * $httpBackend is used to flush http requests which may be linked thru
     * services in your controller to be performed synchronously.
     *
     * @see http://docs.angularjs.org/api/ngMock.$httpBackend
     * @see http://docs.angularjs.org/api/ngMockE2E.$httpBackend
     * @type {ng.$httpBackend}
     */
    var $httpBackend;

    var filter, $rootScope, oldOptions;

    beforeEach(angular.mock.module('ngMock','kpmgAngular'));

    beforeEach(function (done) {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;//bumping up load time for bamboo to prevent premature failure
        inject(function ($filter, $injector) {
            $rootScope = $injector.get('$rootScope');
            $httpBackend = $injector.get('$httpBackend');
            filter = $filter('kLocalize');
            $httpBackend.resetExpectations();
            oldOptions = $.i18n.options || {};
            var options = angular.extend({}, oldOptions, {getAsync: true});
            $.i18n.init(options, function () {
                $.i18n.addResourceBundle('en', 'translation', {
                    kLocalize: {
                        test1: 'this is a test',
                        test2: {
                            test3: '__0__ and __1__ went up the hill'
                        },
                        test3: {
                            test4: '__who__ went up the hill'
                        }
                    }
                });
                done();
            });
        });
    });

    it('should be defined in module', function () {
        expect(filter).toBeDefined();
    });

    it('should return proper filtered value for simple key', function () {
        expect(filter('kLocalize.test1')).toEqual('this is a test');
    });

    it('should not load already loaded namespace', function () {
        spyOn($.i18n, 'loadNamespace');
        expect(filter('translation:kLocalize.test1')).toEqual('this is a test');
        expect($.i18n.loadNamespace).not.toHaveBeenCalled();
    });

    it('should return proper filtered value for simple key from a module not yet loaded', function (done) {
        expect(filter('testing:kLocalize.key')).toEqual('');
        $rootScope.$on('kLocalizeChanged', function () {
            var value = filter('testing:kLocalize.key');
            if (value) {
                expect(value).toEqual('value');
                done();
            }
            //else we will time out waiting for it to load
        });
    });

    it('should return proper filtered value for simple key with string replacements', function () {
        expect(filter('kLocalize.test2.test3', 'Jack', 'Jill')).toEqual('Jack and Jill went up the hill');
    });

    it('should return proper filtered value for simple key with object or replacements', function () {
        expect(filter('kLocalize.test3.test4', {who: 'Jack'})).toEqual('Jack went up the hill');
    });

    it('should auto load new namespace', function () {
        spyOn($.i18n, 'loadNamespace');
        filter('doesnotexist:test5');
        expect($.i18n.loadNamespace).toHaveBeenCalled();
        expect($.i18n.loadNamespace.calls.mostRecent().args[0]).toBe('doesnotexist');
    });

    afterEach(function () {
        $.i18n.options = oldOptions;
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });


});
