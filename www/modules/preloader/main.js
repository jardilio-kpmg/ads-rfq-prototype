var loadingScreen = require('./loadingScreen');
loadingScreen.show();

//TODO: add any additional initialization steps for before libs and other modules are loaded

/**
 * A global object reference for controlling preloading functions.
 * @module preloader/main
 * @example
 * var preloader = require('www/modules/preloader/main');
 */
module.exports = {

    /**
     * Timestamp reference to when page execution first starts.
     * @type {date}
     * @example
     * preloader.timestamp = new Date();
     */
    timestamp: window.timestamp,

    /**
     * Run this after libs have loaded, will initialize localization.
     * @example {@lang xml}
     * <script src="libs.js"></script>
     * <script>preloader.afterLibs();</script>
     */
    afterLibs: function(){

        // load & initialize localization
        require('./localization')();

        //TODO: add any additional initialization steps for after libs are loaded but before other modules
    },

    /**
     * Run after modules have loaded, will remove the loading screen.
     * @example {@lang xml}
     * <script src="modules.js"></script>
     * <script>preloader.afterModules();</script>
     */
    afterModules: function(){

        // Remove the loading screen
        loadingScreen.remove();

        //TODO: add any additional initialization steps for after everything is loaded
    }

};
