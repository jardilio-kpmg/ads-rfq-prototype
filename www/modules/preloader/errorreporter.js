/**
 * @module preloader/reporter
 */
module.exports = {

    /**
     * @param error
     */
    send: function() {//error) {
        //TODO: integrate with error reporting services in backend
        return;/*
        var $ = require('jquery');
        console.log('Reporting error to server: ' + JSON.stringify(error, null, '\t'));
        $.ajax('api/error', {
            data : JSON.stringify(error),
            contentType : 'application/json',
            type : 'POST'
        });*/
    }

};
