describe('kpmg/angular/services/kUtil.js', function () {



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
     * @type {KUtil}
     */
    var service, service2;

    beforeEach(angular.mock.module('ngMock','kpmgAngular'));

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        service = $injector.get('kUtil');
        service2 = $injector.get('kUtil');
        $httpBackend.resetExpectations();
    }));

    it('should be defined in module', function () {
        expect(service).toBeDefined();
    });

    it('should be a singleton', function () {
        expect(service).toBe(service2);
    });

    it('should correctly create a Trigger', function () {
        var trigger = service.trigger();
        var callback = window.jasmine.createSpy();
        var callback2 = window.jasmine.createSpy();
        var callback3 = window.jasmine.createSpy();

        trigger.on(callback);
        var off2 = trigger.on(callback2);
        trigger.on(callback3);

        trigger();
        expect(callback).toHaveBeenCalledWith();

        trigger(1);
        expect(callback).toHaveBeenCalledWith(1);

        trigger(1, 'test');
        expect(callback).toHaveBeenCalledWith(1, 'test');

        trigger(1, 'test', 2);
        expect(callback).toHaveBeenCalledWith(1, 'test', 2);

        trigger(1, 'test', 2, 3);
        expect(callback).toHaveBeenCalledWith(1, 'test', 2, 3);

        trigger(1, 'test', 2, 3, 4);
        expect(callback).toHaveBeenCalledWith(1, 'test', 2, 3, 4);

        trigger(1, 'test', 2, 3, 4, 5);
        expect(callback).toHaveBeenCalledWith(1, 'test', 2, 3, 4, 5);

        trigger(1, 'test', 2, 3, 4, 5, 6);
        expect(callback).toHaveBeenCalledWith(1, 'test', 2, 3, 4, 5, 6);

        trigger(1, 'test', 2, 3, 4, 5, 6, 7);
        expect(callback).toHaveBeenCalledWith(1, 'test', 2, 3, 4, 5, 6, 7);

        trigger(1, 'test', 2, 3, 4, 5, 6, 7, 8);
        expect(callback).toHaveBeenCalledWith(1, 'test', 2, 3, 4, 5, 6, 7, 8);

        trigger(1, 'test', 2, 3, 4, 5, 6, 7, 8, 9);
        expect(callback).toHaveBeenCalledWith(1, 'test', 2, 3, 4, 5, 6, 7, 8, 9);

        trigger(1, 'test', 2, 3, 4, 5, 6, 7, 8, 9, 10);
        expect(callback).toHaveBeenCalledWith(1, 'test', 2, 3, 4, 5, 6, 7, 8, 9, 10);

        trigger(1, 'test', 2, 3, 4, 5, 6, 7, 8, 9, 10, 11);
        expect(callback).toHaveBeenCalledWith(1, 'test', 2, 3, 4, 5, 6, 7, 8, 9, 10, 11);

        expect(trigger.hasListeners()).toBe(true);

        var numCalls = callback.calls.count();
        trigger.off(callback);
        trigger();
        expect(callback.calls.count()).toBe(numCalls);
        expect(callback2.calls.count()).toBe(numCalls+1);
        expect(callback3.calls.count()).toBe(numCalls+1);

        off2();
        trigger();
        expect(callback.calls.count()).toBe(numCalls);
        expect(callback2.calls.count()).toBe(numCalls+1);
        expect(callback3.calls.count()).toBe(numCalls+2);

        trigger.off();
        trigger();
        expect(callback.calls.count()).toBe(numCalls);
        expect(callback2.calls.count()).toBe(numCalls+1);
        expect(callback3.calls.count()).toBe(numCalls+2);

        expect(trigger.hasListeners()).toBe(false);
    });

    it('should return correct scroll target', function () {
        var $container = angular.element('<div class="container"><div class="scroller"><div class="content"></div></div></div>');

        angular.element('body').append($container);

        var $scroller = $container.find('.scroller'),
            $content = $container.find('.content');

        expect(service.getScrollTarget($content, 'x')[0]).toBe(window);
        expect(service.getScrollTarget($content, 'y')[0]).toBe(window);

        $scroller.css({
            'overflow-x': 'auto',
            'overflow-y': 'hidden'
        });
        expect(service.getScrollTarget($content, 'x')[0]).toBe($scroller[0]);
        expect(service.getScrollTarget($content, 'y')[0]).toBe(window);

        $scroller.css('overflow-y','scroll');
        expect(service.getScrollTarget($content, 'x')[0]).toBe($scroller[0]);
        expect(service.getScrollTarget($content, 'y')[0]).toBe($scroller[0]);

        $container.remove();
    });

    it('should return proper name value', function () {
        expect(service.getName()).toBe('kUtil');
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
