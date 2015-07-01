#Overview

##Summary

This project utilizes a simple web starter kit using Grunt. All the basic tasks you need for web development are included,
from packaging, minification, concatenation, testing, servers, scaffolding...

The build system uses [browserify](http://browserify.org/) for the packaging system. By default, you are not required to use require syntax (
require, exports...) in your code. You can simply write code like normal and each file will be wrapped and executed
in an isolated scope as to not accidentally impact the global namespace. You may however use require statements and
exports if you wish and this will all be supported. You can use require statements to control load ordering and
dependencies, or even to pipe in different options like including style references in your DOM using cssify.

Default transforms are included in the build to handle the following:

* `require('file.css')` - This will include the referenced CSS file into the JavaScript bundle and automatically append it to the DOM.
The CSS will be minified using [cssmin](https://www.npmjs.org/package/cssmin) and prefixed using
[autoprefixer](https://github.com/postcss/autoprefixer). You don't need to worry about writing browser
specific prefixes in your source anymore.
* `require('file.less')` - This will process a less file, following all imports and then follow the same steps as *.css above.
* `require('file.scss')` - This will process a scss file (using [node-sass](https://github.com/sass/node-sass)), following all
imports and then follow the same steps as *.css above. This also works for *.sass extensions.
* `require('file.html')` - This will store a text file as a string variable for reference. This also works for
*.txt, *.tmpl and *.tpl extensions.

##Getting Started

Make sure you have the following prerequisites installed:

* Install Node.js from http://nodejs.org/
* Windows users must also install msysgit from https://github.com/msysgit/msysgit/releases/
    * Download the "full installer for official Git for Windows" version
    * During installation, choose the option "Run Git from the Windows Command Prompt"
    * Restart your machine

Once you have the prerequisites out of the way, you can clone the project from the command line:

```
    cd /path/to/projects
    git clone https://github.com/jardilio-kpmg/ads-rfq-prototype.git
    cd ads-rfq-prototype
```

* First time setup of global dependencies on your machine:

```
    npm install grunt-cli -g
    npm install bower -g
```

* Finally, setup your local dependencies for the project:

```
    npm install && bower install
```

If you run into an error during `npm install`, this could be permissions based. See http://stackoverflow.com/questions/16151018/npm-throws-error-without-sudo
for more information about how to fix npm permissions on your machine. You will need to run `npm install` again after fixing
this.

#Basic Commands

##Bower

[Bower](http://bower.io/) was installed for you automatically along with a minimal number of client-side dependencies. Use bower to
search for other components you would like to install:

    bower find angular

This will list out all registered components in bower that match "angular". When you are know the name of the
component to install:

    bower install angular --save

This will download the component and all its dependencies into `www/libs` (defined in .bowerrc). The --save flag
will save this dependency into bower.json as an application dependency for runtime.

The included build process in the starter will track all dependencies in bower.json and bundle them for you automatically
into a file named `libs/libs.js`. The `index.html` file is already setup to include this file. All dependencies are
loaded and concatenated in order as defined by each bower components dependency tree.

If you don't want the downloaded bower component to be bundled automatically (ie like jasmine which is only used for
testing), you just need to install it as a development dependency:

    bower install jasmine --save-dev

This will install jasmine as a development dependency which is not tracked by the builds bundler and will not be
included in `libs/libs.js`. You can then manually include these files in your project.

##Grunt

[Grunt](http://gruntjs.com/) was installed for you automatically along with a variety of custom and public tasks. For most users, you simply
need to issue the `grunt` command from your project directory and you will be prompted with all the available options.

    grunt
    [?] What task would you like to run? (Use arrow keys)
    ❯ Run the Scaffolding Tools to Build Out Project
      Run the Web Application
      Run the Cordova Application
      Run the API Designer
      Run the Test Suite
      Publish the Application for Deployment

###Run the Web Application

This option will compile the application, spawn a web server and open your browser to run the web application. It will
then watch for changes and reload the page automatically when changes are detected.

Just run the `grunt` command and choose the web application option.

    [?] What task would you like to run?
      Run the Scaffolding Tools to Build Out Project
    ❯ Run the Web Application
      Run the Cordova Application
      Run the API Designer
      Run the Test Suite
      Publish the Application for Deployment

You will then be prompted with some followup questions for how to run the server.

    [?] What task would you like to run? Run the Web Application
    [?] Which server target do you want to run? (Use arrow keys)
    ❯ Development (minimal concatination)
      Production (concatination and minification

You can also bypass these prompts by using the `grunt server` and `grunt server:dist` commands.

###Run the Scaffolding Tools to Build Out Project

No default scaffolds are included in the base project. It is intended that the base webstart project will be forked for
each target platform to add platform specific functionality and scaffolding tasks.

Just run `grunt` from the command line and choose the scaffolding option.

    grunt
    [?] What task would you like to run? (Use arrow keys)
    ❯ Run the Scaffolding Tools to Build Out Project
      Run the Web Application
      Run the Cordova Application
      Run the API Designer
      Run the Test Suite
      Run the Documentation Generator
      Publish the Application for Deployment

You will then be prompted with some followup questions:

    [?] Which scaffolding task would you like to run? test
    [?] What action do you want to perform? create
    [?] What is the name of the component? mycomponent
    [?] What is the name of the module for the component? (main) mymodule

You can bypass the initial prompts by running `grunt scaffold`. You can also pass in the answers to the questions using
the target and a comma delimited list:

    grunt scaffold:test,create,mycomponent,mymodule

For more information about available scaffolding options in this project, see [scaffolds](build/scaffolds).

###Run the Cordova Application

Support is also included for building Cordova based applications. During the initial setup or your project, you
were asked if you want to use Cordova for your application. If you selected this option, you were presented with a
few questions to setup the Cordova project:

    [?] What is the title to give your application? webstart
    [?] What is the identifier to give your application? com.webstart
    [?] What platforms do you need to support? (Press <space> to select)
    ❯⬢ ios
     ⬡ android
     ⬡ amazon-fireos
     ⬡ blackberry10
     ⬡ firefoxos
     ⬡ wp8
     ⬡ windows8

This will setup and install all the required cordova dependencies into the current project directory. The build system
will check for all platforms/*/www directory references and will compile each of these separately with your merged
platform changes in platforms/*/platform_www. The build process includes hooks with Cordova so that post prepare after
Cordova has merged the root www with each platforms/*/platform_www into platforms/*/www, the build system will compile
each of these platforms separately and publish the results back into platforms/*/www.

If for any reason you skipped this step during the initial setup, you will be prompted again the first time
you try to build Cordova application using the `grunt` task:

    grunt
    [?] What task would you like to run?
      Run the Scaffolding Tools to Build Out Project
      Run the Web Application
    ❯ Run the Cordova Application
      Run the API Designer
      Run the Test Suite
      Run the Documentation Generator
      Publish the Application for Deployment

This will prompt you how to run the Cordova application:

    [?] What task would you like to run? Run the Cordova Application
    [?] Hod do you want to run the Cordova Application? (Use arrow keys)
    ❯ Run in Platform Emulator
      Run on Platform Device

You can also bypass the prompt by simply running either `grunt cordova:emulate` or `grunt cordova:run`.

You can also use cordova commands directly to build, run and emulate. The hooks are still in place for grunt to
build the appropriate files. If you use this grunt command, it will also include livereload support by spawning an
internal web server to host the application for each platform and update the config.xml file to point to this server.

###Run the API Designer

The starter includes support for defining API specifications using [RAML](http://raml.org/). The included task here will
launch the RAML Designer tool which provides support for editing and previewing the definitions and documentation.

This will also generate some client side code used for implementing the API and providing mock data for testing
purposes.

You can simply run `grunt` from the command line and choose one of the testing options.

    grunt
    [?] What task would you like to run?
      Run the Scaffolding Tools to Build Out Project
      Run the Web Application
      Run the Cordova Application
    ❯ Run the API Designer
      Run the Test Suite
      Run the Documentation Generator
      Publish the Application for Deployment

You can also bypass the prompt by simply running either `grunt server:apidesigner`.

For more information about available API options in this project, see [api](browse/api).

###Run the Test Suite

The starter includes support for both unit and integration tests. Unit tests are executed with [Karma](http://karma-runner.github.io/0.12/index.html) while 
integration tests are executed by [Protractor](http://angular.github.io/protractor/#/). Unit tests are authored using Jasmine in the `/specs` folder for each 
module. Integration tests are also authored using Jasmine in the `/e2e` folder for each module.

Specs are compiled by browserify so `require(...)` and other NodeJS primitives may be used in specs just as with your other modules.

When tests are executed, app code is first instrumented via Istanbul in order to collect code coverage data.
Currently, all tests are executed within PhantomJS rather than real browsers though this is an opportunity for future enhancement.

You can simply run `grunt` from the command line and choose one of the testing options.

    grunt
    [?] What task would you like to run?
      Run the Scaffolding Tools to Build Out Project
      Run the Web Application
      Run the Cordova Application
      Run the API Designer
    ❯ Run the Test Suite
      Run the Documentation Generator
      Publish the Application for Deployment

You will then be prompted with the following options:

    [?] What task would you like to run? Run the Test Suite
    [?] What tests would do you want to run? (Use arrow keys)
    ❯ Run Unit Tests, Code Coverage and JSHint
      Run End-to-End Integration Tests

You can also bypass the prompt by simply running either `grunt server:test` or `grunt server:e2e`.

When running tests in the browser, you can use browser dev tools to set breakpoints and diagnose issues.
Open http://localhost:9010/debug.html in a browser then open the dev console on this page.  (Tests execute here, 
not within the page that displays the test reults).  The actual running code is instrumented for code 
coverage tracking and then compiled by browserify so you will see some files listed.  Fortunately, 
sourcemaps are in place so the browser dev tools will also make your *original* source files 
available - set your breakpoints in these files and ignore the build-generated files.

###Run the Documentation Generator

This will generate HTML documentation based on the RAML service specifications in /api and run the 
[JSDoc](http://usejsdoc.org/) engine against the current code base. The scaffolding tasks automatically generate code that
includes comments in the JSDoc format that you can use as your template when writing your own code.

By default, all documentation is output to the `bin/documentation`. The server option will watch for changes to
your source code and automatically rebuild and reload the documentation changes in the browser.

The default template engine is using [DocStrap](https://github.com/terryweiss/docstrap) with the
[spacelab](http://terryweiss.github.io/docstrap/themes/spacelab/) theme. You can customize this via the `jsdoc.conf.json`
file in the root of the project.

Simply run the `grunt` command and run documentation option.

    grunt
    [?] What task would you like to run?
      Run the Scaffolding Tools to Build Out Project
      Run the Web Application
      Run the Cordova Application
      Run the API Designer
      Run the Test Suite
    ❯ Run the Documentation Generator
      Publish the Application for Deployment

Then you will be prompted with the following options:

    [?] What task would you like to run? Run the Documentation Generator
    [?] Where do you want to publish documentation to? (Use arrow keys)
    ❯ Run in Browser (livereload)
      Just Export to bin/documentation

You can also bypass the prompt by simply running `grunt server:docs` or `grunt docs`.

###Publish the Application for Deployment

This will run all the build tasks and publish a final compressed output of your application to a directory named `bin`.
This will also zip up the final contents of the dist directory and create a zip and war file for you automatically which
can be used for deployment to a web server.

Simply run the `grunt` command and select the publish option.

    grunt
    [?] What task would you like to run?
      Run the Scaffolding Tools to Build Out Project
      Run the Web Application
      Run the Cordova Application
      Run the API Designer
      Run the Test Suite
      Run the Documentation Generator
    ❯ Publish the Application for Deployment

You can also bypass the prompt by simply running `grunt publish`.

#Bundling

To make development easier, the default build tasks will automatically generate several bundles for you so that you
do not need to spend time manually managing a bunch of script and style tags or the complexities of using RequireJS.
Just start adding files to the designated folders and the bundles are generated for you automatically and are referenced
in the default `index.html` file.

All bundle files are generated to a temporary directory (`.temp`) which when you run the server commands in grunt will
be mapped at the same location as your application and test directories.

##libs

The first bundle created (and previously mentioned) is `libs/libs.js`. This file is generated during a build by watching
changes in bower.json and following all dependency trees (not development dependencies) to concatenate a single bundle.
The bower.json file for each component should include a "main" property indicating the main files of the module that
should be included in the bundle.

This bundle is NOT run through browserify but instead simply concatenated. This allows you to access global variables like
$, _, angular, Backbone...without require statements and creating shims for components that don't support AMD out of
the box.

##modules

The second bundle created is `modules/modules.js`. This is built using all the files matching the pattern `modules/*/scripts/**/*.js`.
This is for convenience to bundling everything together into 1 file that is automatically referenced in
the `index.html` file by default. This generated file will be placed in the `.temp` directory.

You should use the require statements for any CSS, LESS, SCSS, SASS or HTML files you want to process and include in the
modules bundled output.

    require('modules/mymodule/styles/main.less');

###Isolate Modules

You can exclude certain modules from being included in this bundle by declaring them as isolate in the gruntfile. By
default, the preloader module is excluded since its inlined in the top of the page. These modules may be loaded either
in separate HTML files or dynamically at runtime as needed.

<pre>
    grunt.initConfig({
        build: {
            options: {
                isolateModules: ['foo']
            }
        }
    });
</pre>

Each isolate modules directory will be bundled individually. For example, if you have `modules/foo`,
then the build task will watch for changes to `modules/foo/scripts/**/*.js` to concatenate a single bundle named
`modules/foo/foo.js`. This generated file will be placed in the `.temp` directory.

###Module Specs

The contents of the `specs` directory in each module are only included during test builds and are not normally bundled
or included in the published output. You can also launch any grunt task that executes build with the `--specs` option
to enable this.

<pre>
    grunt.initConfig({
        build: {
            options: {
                specs: true
            }
        }
    });
</pre>

###Module Mocks

The contents of the `mocks` directory in each module are included by default in all builds if they exist. This is intended
to include all end-to-end mocks for services when no backend yet exists. You can also launch any grunt task that
executes build with the `--nomocks` option to disable this. You can also set the build option in your gruntfile:

<pre>
    grunt.initConfig({
        build: {
            options: {
                nomocks: true
            }
        }
    });
</pre>

##sprites and font icons

Spritesheet and font icon support is also baked in. By default, the build process will generate a spritesheet for any directory that
contains PNG files in it and font icons for any directory that contains SVG files in it. You can choose whether or not 
to use these generated spritesheet and font icons in your project or not.

Example: If you have `www/modules/mymodule/images/*.png` then the following files will be generated:
`www/modules/mymodule/images/_images.generated.png` and `www/modules/mymodule/images/_images.generated.css` (or less or scss or sass).

Example: If you have `www/modules/mymodule/icons/*.svg` then the following files will be generated:
`www/modules/mymodule/icons/_icons.generated.{woff,eot,ttf,svg}` and `www/modules/mymodule/icons/_icons.generated.css` (or less or scss or sass).

The generated stylesheets can be imported into your master stylesheet and referenced like normal. The less and sass
processors will resolve loading local references both from the source directory and the temporary directory automatically,
so simply import like normal `@import "www/modules/mymodule/images/_images.generated.less"` or `@import "../icons/_icons.generated.scss"`.

*NOTE:* The font generator assumes that SVG's have a size of 512px. If this is not the case, the build can compensate for this if you
include the size in pixels in the name of the containing directory, ie "icons_48px/*.svg". It will set the font size to
base on 48px rather than the default 512px. 

#Localization

Localization is enabled through the [i18next.js](http://i18next.com/) library.  Please review the documentation on that
site for details of the syntax for complex localization strings such as those with pluralization or other parameters.

*NOTE:* The method for invoking i18next.js in your templates and code will vary depending on which fork of this project
you are using.  Consult your fork's documentation for details.

Define your strings in the form of JSON dictionary in `/modules/*/locales/{locale}/translation.json`.  You may define strings
for non-specific locales such as `en` and/or for specific cultures such as `en-GB`.

When the app is loaded with a specific locale, it will download both the specific strings (`en-GB/translation.json`) 
and will also download the non-specific strings (`en/translations.json`) so the specific one only needs to include
strings where the value differs from the non-specific version.  In addition, a 'default locale' must be declared and this
will be used as a fallback if strings cannot be found for the requested locale.

As part of the build process, a 'qps' locale is automatically created.  This is the 
[pseudolocalized](http://en.wikipedia.org/wiki/Pseudolocalization) version of the strings in your default locale 
(defaultlocale is defined in settings.json). By manually testing your app under this `qps` locale, you will be able 
to spot places where strings are hardcoded or where lengthened strings may break the UI flow.  The pseudoloc tool is 
aware of the format i18next.js uses for denoting string parameters and will not alter characters in between
`__` delimiters.  For example, `"Hello __name__"` will be pseudoloc'd to`"[!!Ħĕŀļō __name__!!]"` 

At runtime, i18next determines which locale to load based checking for a `?lang={locale}` querystring or a `lang` cookie.
If a web server would like to specify the locale (based on user location or profile information, for example), it should 
set this cookie.  Likewise, if the UI would like to allow users to switch locales, it need only set this cookie and then
reload the page.  This cookie is the preferred mechanism but the querystring option makes it easy to override the cookie
or server logic such as when using pseudoloc: just add `?lang=qps` to the URL to enable pseudoloc and then
add `?lang=en` to switch back to English.

While JSON is an ideal format for loading localized strings, this is unlikely to the be the format that people performing
translations would like to use.  A more common format for which there are specialized translation tools is RESX.  There 
are 2 custom grunt tasks included in this project that enable working with RESX files.

  1.  `grunt localization:toRESX` will create a RESX files corresponding to each JSON file under `/modules/*/locales`
  2.  `grunt localization:fromRESX` will overwrite the JSON files to reflect changes made in the previously exported RESX files.
A message will be displayed listing all additions/removals/modifications for easy review.

#Profile Based Configurations
In most applications, you will need to need some profile based configuration options. Lets say for instance that your
3rd party services endpoint needs to configured differently for each published profile. Or you may want to capture something
like the current version number of the application and pass in some suffix value from a CI server.

Open `gruntfile.js` and set the config options for `profiles`

<pre>
    profiles: {
        //TODO: register your default base configuration options
        default: {
            //this is the base configuration that specific profiles will merge into
            config: {
                version: '<%= package.version %>.' + (grunt.option('buildnum') || 'local'),
                server: 'http://default.domain.com:8080/'
            }
        },
        //TODO: register your profile specific configuration options
        testing: {
            //these settings will merge into default if using the --profile=testing option when running grunt
            config: {
                server: 'http://testing.domain.com:8080/'
            }
        },
        staging: {
            //these settings will merge into default if using the --profile=staging option when running grunt
            config: {
                server: 'http://staging.domain.com:8888/'
            }
        },
        production: {
            //these settings will merge into default if using the --profile=production option when running grunt
            config: {
                server: 'http://production.domain.com/'
            }
        }
    }
</pre>

Now, you can run any grunt task with the following options:

    grunt build --profile=production --buildnum=${bamboo.buildNumber}

Now you can access these merged configuration options using `require('config')`:

    var config = require('config');

    console.log(config.version);//1.0.0.312
    console.log(config.server);//http://production.domain.com/

You can customize this config object in `gruntfile.js` to whatever your application needs.
