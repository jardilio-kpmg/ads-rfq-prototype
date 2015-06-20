/**
 * This default implementation leverages the modal API from Twitter Bootstrap
 * but can be replaced with an alternate implementation without modifying other
 * parts of the error handling mechansim
 *
 * @module preloader/errordialog
 */

module.exports = {
    /**
     * Displays a message to the user in a way that blocks further user actions.
     * Once the user has acknowledged the message, the page reloads to return the app to a known-good state.
     * @param error
     * @param error.id a unique id value to display to users which corresponds to a value logged to the server
     * @param error.message a localized string to display to users
     */
    show: function(error) {
        var html = require('./errordialog.html');
        var $ = require('jquery');
        var i18n = require('i18next');

        try {
            // Add the dialog template to the end of <body>

            $(document.body).append(typeof(html) === 'function' ? html() : html);//could be template function

            var $dialog = $('#errorDialogModal'),
                $errorId = $dialog.find('.error-id'),
                $errorMessage = $dialog.find('.error-message');

            $errorMessage.html(error.message);
            $errorId.data('i18n-options', {id: error.id}); // set the 'id' variable which the localized string will reference
            $dialog.i18n(); // invoke localization

            if (!$errorId.text()) {
                $errorId.text(error.id);
            }

            // handle the dialog being dismissed by reloading the page so we return to a known-good state
            $dialog.on('hide.bs.modal', function () {
                // TODO: consider also cleaning localstorage, etc if cached data could prevent being in a known-good state
                window.location.reload();
            });

            $dialog.modal(); // show the modal

        } catch(ex) {
            // We'll end up here if an error occurs before Bootstrap has loaded. Fall back to a confirmation
            // which devs can click 'cancel' on and open up a debugger
            if(window.confirm(error.message + '\n\n' + i18n.t('preloader.errorDialog-id', {id: error.id}))) {
                window.location.reload();
            }
        }
    }
};
