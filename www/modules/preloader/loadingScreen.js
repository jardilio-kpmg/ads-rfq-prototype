// Shows and removes the loading screen

require('./loadingScreen.less');
var html = require('./loading.html');
var loadingScreen = document.createElement('div');

loadingScreen.innerHTML = typeof(html) === 'function' ? html() : html;//could be template function

/**
 * @module preloader/loadingscreen
 * @example
 * var loadingScreen = require('modules/preloader/loadingscreen');
 */
module.exports = {

    /**
     * Show the loading screen
     * @example
     * loadingScreen.show();
     */
    show: function(){

        if (!loadingScreen.parentNode) {
            document.body.appendChild(loadingScreen);
        }
    },

    /**
     * Hide the loading screen
     * @example
     * loadingScreen.show();
     */
    remove: function(){

        if (loadingScreen.parentNode) {
            loadingScreen.parentNode.removeChild(loadingScreen);
        }
    }
};
