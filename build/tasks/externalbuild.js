var path = require('path');

module.exports = function(grunt) {
    grunt.registerTask('buildForDotNet', function(target) {
        //default options, override in gruntfile.js config with buildForDotNet.options if you change project location
        var options = this.options({
                targetProjectDir: './WebStart.NET',         //project directory
                targetProjectFile: 'WebStart.NET.csproj',   //project file relative to project directory
                targetProjectBin: 'ClientBuild'             //project output bin dir relative to project directory
            }),
            distPath = path.resolve(options.targetProjectDir, options.targetProjectBin),
            projFile = path.resolve(options.targetProjectDir, options.targetProjectFile);

        grunt.config.set('settings.dir.dist', distPath);
        grunt.config.set('build.options.dist', target === 'release');
        grunt.config.set('build.options.watch', true);

        grunt.registerTask('buildForDotNet-updatecsproj', function () {
            var buildfiles = grunt.file.expand({cwd: options.targetProjectDir, filter: 'isFile'}, options.targetProjectBin + '/**/*.*'),
                wwwfiles = grunt.file.expand({filter: 'isFile'}, grunt.config('settings.dir.app') + '/**/*.*'),
                projects = grunt.file.expand('*.csproj'),
                csprojeditor = require('./libs/csprojeditor');

            csprojeditor.addAndRemoveProjectFiles(projFile, buildfiles, [options.targetProjectBin], true);
            projects.forEach(function (csproj) {
                csprojeditor.addProjectFiles(csproj, wwwfiles);
            });

            grunt.log.writeln('You may now run your web application from Visual Studio as normal'.yellow);
        });

        grunt.task.run([
            'clean',
            'build:www',
            'copy:publish',
            'buildForDotNet-updatecsproj',
            'watch'
        ]);
    });
};