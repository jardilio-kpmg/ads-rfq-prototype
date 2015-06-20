document.addEventListener('deviceready', function () {
    console.log('device ' + cordova.platformId + ' is ready!');
});
require('scriptjs')('cordova.js', function () {
    console.log('cordova ' + cordova.platformId + ' is available!');
});