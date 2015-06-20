var <%= headlessCamelCase(scaffold.name) %> = require('modules/<%= scaffold.module %>/<%= scaffold.name %>');

describe('<%= scaffold.module %>/<%= scaffold.name %>.js', function () {

    it('should return <%= scaffold.name %> instance', function () {
        expect(<%= headlessCamelCase(scaffold.name) %>).toBeDefined();
    });

    it('should return name', function () {
        expect(<%= headlessCamelCase(scaffold.name) %>.getName()).toBe('<%= scaffold.name %>');
    });

});

