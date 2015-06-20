var _ = require('lodash');
/**
 * This is the default base Context to be used for scaffolding tasks.
 * This uses 'class.extend', so you can extend this Engine with your
 * own functionality. This is used as the source object fed
 * into the templates for bindings.
 *
 * @example
 * var TemplateContext = require('libs/TemplateContext');
 * var MyTemplateContext = TemplateContext.extend({ myFunction: function () {...} });
 *
 * var context = new MyTemplateContext(grunt);
 *
 * @class TemplateContext
 */
module.exports = require('class.extend').extend({

    init: function (data) {
        _.extend(this, data);
    },

    concat: function () {
        return arguments.join('');
    },

    hyphenCase: function (value) {
        value = this.headlessCamelCase(value);

        if (value) {
            value = value.replace(/([A-Z]+)([a-z])/g, function (a, b, c) {
                return '-' + b.toLowerCase() + c;
            });
        }

        return value;
    },

    headlessCamelCase: function (value) {
        value = this.camelCase(value);

        if (value) {
            //lowercase first character
            value = value.charAt(0).toLowerCase() + value.substr(1);
        }

        return value;
    },

    camelCase: function (value) {
        if (!value)
            return '';

        //uppercase first character
        value = (value.charAt(0).toUpperCase() + value.substr(1)).trim();

        //uppercase character after space or hyphen or underscore
        value = value.replace(/([_ -\/]+)([a-zA-Z0-9])/g, function(a, b, c) {
            return c.toUpperCase();
        });

        //uppercase character after number
        value = value.replace(/([0-9]+)([a-zA-Z])/g, function(a, b, c) {
            return b + c.toUpperCase();
        });

        return value;
    },

    commentBlock: function(value, lead){
        value = value || '';
        return (lead + value.trim().replace(/\n/g, '\n'+lead).trim());
    }

});
