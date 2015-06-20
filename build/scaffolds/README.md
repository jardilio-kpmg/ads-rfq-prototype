#Scaffolding Tasks

All of the scaffolding tasks are accessible from the default grunt task prompt and selecting the scaffolding
option ('Run the Scaffolding Tools to Build Out Project').

Just run `grunt` from the command line and choose the scaffolding option.

    grunt
    [?] What task would you like to run? (Use arrow keys)
    ❯ Run the Scaffolding Tools to Build Out Project
      Run the Web Application
      Run the Cordova Application
      Run the Test Suite
      Run the Documentation Generator
      Publish the Application for Deployment

You will then be prompted with some followup questions that will vary per scaffold task:

    [?] Which scaffolding task would you like to run? module
    [?] What action do you want to perform? create
    [?] What is the name of the component? mymodule

You can bypass the initial prompts by running `grunt scaffold`. You can also pass in the answers to the questions using
the target and a comma delimited list:

    grunt scaffold:module,create,mymodule

##module

The `module` scaffold task will stub out a basic module structure in your application into the path
`www/modules/[scaffold.name]` and include the following:

* **locales/[settings.defaultlocale]/translation.json** - This is an i18next resource bundle for localized content accessible
to the module for the default language as setup in `settings.json'.
* **mocks** - A directory for all mock data to be bundled with the application at runtime. Mocks can be excluded during
a build process by using the `--nomocks` flag when running any grunt task.
* **scripts/main.js** - The main entry point for your module and directory for containing all module script files.
Creates a default class that will be exported if using require notation.
* **specs/main.spec.js** - The unit tests stubbed out for the modules main file and directory for containing all module spec files.
* **styles/main.[settings.styleformat]** - Creates a default stylesheet using the style format as specified in `settings.json`.
As other scaffolding tasks add new stylesheets to this directory that begin with an underscore (_), the scaffolding
engine will automatically include an import statement in `styles/main.[settings.styleformat]` for this new stylesheet.

During the scaffolding questions, you will be asked if you want to also create a new View to link to your Module. If
you choose so, the View scaffolding task will be executed and the generated View will be include in your Module.

##exports

The `exports` scaffold task will stub out a generic CommonJS style module export into `www/modules/[scaffold.module]`.
This will include the following files:

* **scripts/[scaffold.name].js** - The CommonJS style export file.
* **specs/[scaffold.name].spec.js** - The unit tests stubbed out for the export file.

##controller

The `controller` scaffold task will stub out an AngularJS Controller instance into `www/modules/[scaffold.module]`. You
may call this task to create controllers later in your project, but more than likely this task will be executed automatically
as the result of creating a View or Directive using one of those scaffolding tasks.

This will generate the following files:

* **scripts/controllers/[scaffold.name].js** - This is the stubbed out definition of your controller instance registered
to the linked module.
* **specs/controllers/[scaffold.name].spec.js** - This contains the unit tests for the controller and all the setup and tear down
steps required to test the controller instance.

##directive (behavior)

The `directive (behavior)` scaffold task will stub out an AngularJS Directive instance into `www/modules/[scaffold.module]`.
This type of Directive will register by default as an Attribute type directive intended to modify the behavior of a target
element. This type of directive contains no template associated with it.

This will generate the following files:

* **scripts/directives/[scaffold.name].js** - This is the stubbed out definition of your directive instance registered
to the linked module.
* **specs/directives/[scaffold.name].spec.js** - This contains the unit tests for the directive and all the setup and tear down
steps required to test the directive instance.

During the scaffolding questions, you will be asked if you want to also create a new Controller to link to your Directive. If
you choose so, the Controller scaffolding task will be executed and the generated Directive will include code to automatically
link the Directive properly to the new Controller.

##directive (component)

The `directive (component)` scaffold task will stub out an AngularJS Directive instance into `www/modules/[scaffold.module]`.
This type of Directive will register by default as an Element type directive intended to modify the DOM of a target
element with an included template.

This will generate the following files:

* **scripts/directives/[scaffold.name].html** - This is is the HTML markup template that will be associated with your directive.
* **scripts/directives/[scaffold.name].js** - This is the stubbed out definition of your directive instance registered
to the linked module.
* **specs/directives/[scaffold.name].spec.js** - This contains the unit tests for the directive and all the setup and tear down
steps required to test the directive instance.
* **scripts/styles/_[scaffold.name].[settings.styleformat]** - This is a stylesheet created just for the rules of the associated
directive. This file will be imported into the modules main stylesheet automatically.

During the scaffolding questions, you will be asked if you want to also create a new Controller to link to your Directive. If
you choose so, the Controller scaffolding task will be executed and the generated Directive will include code to automatically
link the Directive properly to the new Controller.

##factory

The `factory` scaffold task will stub out an AngularJS Factory instance into `www/modules/[scaffold.module]`. Similar to
a Service, but this returns a constructor to a class that can be instantiated for many instances rather than being treated
as a singleton.

This will generate the following files:

* **scripts/factories/[scaffold.name].js** - This is the stubbed out definition of your factory constructor registered
to the linked module.
* **specs/factories/[scaffold.name].spec.js** - This contains the unit tests for the factory and all the setup and tear down
steps required to test the factory instances.

##filter

The `filter` scaffold task will stub out an AngularJS Filter function into `www/modules/[scaffold.module]`. This is used
both for filtering and/or formatting of data generally used in binding expressions but can also be injected as a
dependency into other controllers, directives, services...

This will generate the following files:

* **scripts/filters/[scaffold.name].js** - This is the stubbed out definition of your filter function registered
to the linked module.
* **specs/filters/[scaffold.name].spec.js** - This contains the unit tests for the filter function and all the setup and tear down
steps required to test the filter function.

##service

The `service` scaffold task will stub out an AngularJS Service instance into `www/modules/[scaffold.module]`. Similar to
a Factory, but this returns a singleton instance of the service that is lazy instantiated on demand.

This will generate the following files:

* **scripts/service/[scaffold.name].js** - This is the stubbed out definition of your service instance registered
to the linked module.
* **specs/service/[scaffold.name].spec.js** - This contains the unit tests for the service and all the setup and tear down
steps required to test the factory instances.

##service (http)

The `service (http)` scaffold task will stub out an AngularJS Service instance into `www/modules/[scaffold.module]`. Similar to
a standard Service, but this includes an AngularJS $http service reference and is intended to act as a HTTP services API
implementation. It should be the responsibility of this service to expose public methods that will correctly construct
HTTP requests and return a promise. The benefits to doing this rather than using $http directly in your Controllers is
that you standardize the construction of each particular call in a single location that can be tested against and shared in
many locations and ensure that the request is consistently constructed correctly.

This will generate the following files:

* **mocks/service/[scaffold.name].mock.js** - (Optional) Contains mock interceptors for the service for creating E2E tests without a live backend.
* **scripts/service/[scaffold.name].js** - This is the stubbed out definition of your service instance registered
to the linked module.
* **specs/service/[scaffold.name].spec.js** - This contains the unit tests for the service and all the setup and tear down
steps required to test the factory instances.

During the scaffolding questions, you will be asked if you want to also create a mock implementation for your Service.
The mock files will only be generated if you choose this option.

##view

The `view` scaffold task will stub out an AngularJS Route to a View into `www/modules/[scaffold.module]`. The default Route
created makes the following assumptions (all of which can be changed by the user after the fact):

* The default route created uses the format '/[scaffold.module]/[scaffold.name]'
* Both the module and view names are converted using the hyphencase format in the route path
* If the target module is the default module specified in `settings.json`, then the module name will be omitted from the
path as it is assumed to be the default. i.e. the path becomes `/[scaffold.name]`.
* If the view name is either `index`, `default` or `home` then the view name will be omitted from the path as it is assumed
to be the default.  i.e. the path becomes `/[scaffold.module]` or simply `/` if this is in the default module.
* The route will redirect to a login page if the user is not already authenticated. The stubbed out unit tests will also
test this behavior.

This will generate the following files:

* **scripts/directives/[scaffold.name].html** - This is is the HTML markup template that will be associated with your view.
* **scripts/directives/[scaffold.name].js** - This is the stubbed out definition of your route instance registered
to the linked module.
* **specs/directives/[scaffold.name].spec.js** - This contains the unit tests for the directive and all the setup and tear down
steps required to test the view instance.
* **scripts/styles/_[scaffold.name].[settings.styleformat]** - This is a stylesheet created just for the rules of the associated
view. This file will be imported into the modules main stylesheet automatically.

During the scaffolding questions, you will be asked if you want to also create a new Controller to link to your View. If
you choose so, the Controller scaffolding task will be executed and the generated View will include code to automatically
link the View properly to the new Controller.

#Building your own Scaffolds

##Overview
You can create your own scaffolding tasks very easily without writing any code. You just need to create your template
files (using the default [lodash.template](http://lodash.com/docs#template) format) into a specific structure. You can
use a preexisting scaffold as a basis for your new scaffold.

* Create a new folder under `build/scaffolds`. The name of this folder you create is the name of the task presented to the
user when you using the scaffolding option from the `grunt scaffold` command.
* Anything in this folder will be resolved and copied to the projects root directory when the scaffolding task is completed.
* The default context file used in the templates is a mix of data collected from the scaffolding questions and the project
settings:

<pre>
    {
        "settings": {
            "dir": {
                "temp": ".temp",
                "app": "www",
                "test": "test",
                "dist": "dist",
                "cordova": "."
              },
              "styleformat": "css"
        },
        "scaffold": {
            "task": "controller",
            "action": "create",
            "name" : "MyController",
            "module": "main"
        }
    }
</pre>

* The context object also includes helper methods: camelCase, headlessCamelCase, hyphenCase, concat. These can be used
in conjunction with the values from the context object in your template files.

    <%= camelCase(scaffold.name) %>

* File and folder names use a simplified version of the templating. Just wrap your property names in brackets.

    [scaffold.name]

* Finally, any template stylesheet you include that begins with `_` will automatically be added as an import to any
existing stylesheet in the same destination directory that does not begin with `_`.

Check out the `module` scaffold that is in the current project for reference.

##Advanced Options
You can customize the functionality of the scaffold by simply creating a `scaffold.js` file in your scaffold task directory.
This file will expected to be formatted like a standard grunt file (`module.exports = function (grunt) {...};`). If the file
`build/scaffolds/*/scaffold.js` exists, it will be executed as soon as the scaffold task is selected at the user prompt.

In your `scaffold.js` file, you can add custom tasks, config settings and listen for special events to hook into the scaffolding
system. By doing this, you can prompt for additional input from the user and/or perform additional pre and post scaffold processing.

Events are emitted using a format of `scaffold.[scaffold.task].[stage]`. There are 4 stages: `prompt`, `prompted`, `execute` and `executed`.
From the event listener, you can use `grunt.config('scaffold')` to access the current scaffold options data collected during the prompts.

Example:
<pre>
    module.exports = function (grunt) {

        'use strict';

        grunt.event.on('scaffold.module.prompt', function (event) {
            //scaffold will start prompting questions for "module" task
            //event.preventDefault() would cancel this
            //grunt.task.run('moduleprompt') would run 'moduleprompt' before prompting begins
        });

        grunt.event.on('scaffold.module.prompted', function (event) {
            //scaffold has finished prompting questions for "module" task
            //event.preventDefault() does nothing
            //grunt.task.run('moduleprompted') would run 'moduleprompted' after prompting ends
        });

        grunt.event.on('scaffold.module.execute', function (event) {
            //scaffold will start executing "module" task using the information collecting during prompt
            //event.preventDefault() would cancel this
            //grunt.task.run('moduleexecute') would run 'moduleexecute' before execution begins
        });

        grunt.event.on('scaffold.module.prompted', function (event) {
            //scaffold has finished executing "module" task
            //event.preventDefault() does nothing
            //grunt.task.run('moduleexecuted') would run 'moduleexecuted' after execution ends
        });

        grunt.config.merge({
            //add/modify config options
        });

        grunt.registerTask('moduleprompt', function () {
            //do something
        });

        grunt.registerTask('moduleprompted', function () {
            //do something
        });

        grunt.registerTask('moduleexecute', function () {
            //do something
        });

        grunt.registerTask('moduleexecuted', function () {
            //do something
        });

    };
</pre>