var isImportStyleSheet = /_.*\.(css|less|sass|scss)$/,
    isStyleSheet = /\.(css|less|sass|scss)$/,
    importrgx = /@import\s+(url\()?['"]?([^'"\(\)]*)['"]?[\)]?;/gi,
    pathvarrgx = /\[([A-Za-z0-9_\\(\).]+)\]/,
    expand = require('glob-expand'),
    path = require('path'),
    fs = require('fs-extra');

/**
 * This is the default base Engine to be used for scaffolding tasks.
 * This uses 'class.extend', so you can extend this Engine with your
 * own functionality.
 *
 * @example
 * var TemplateEngine = require('libs/TemplateEngine');
 * var MyTemplateEngine = TemplateEngine.extend({ myFunction: function () {...} });
 *
 * var engine = new MyTemplateEngine(context, styleformat);
 *
 * @class TemplateEngine
 */
module.exports = require('class.extend').extend({

    init: function (context, styleformat) {
        this.styleformat = styleformat || 'css';
        this.context = context;
        this.srcFiles = expand({filter: 'isFile'}, [
            'build/scaffolds/' + context.scaffold.task + '/**/*.*',
            '!build/scaffolds/' + context.scaffold.task + '/scaffold.js'
        ]);
        this.dstFiles = this.getDestinationFiles(this.srcFiles, context);
    },

    isMasterStyleSheet: function (path) {
        return isStyleSheet.test(path) && !isImportStyleSheet.test(path);
    },

    /**
     * Resolve the source template file paths with the destination path.
     * @function TemplateEngine#getDestinationFiles
     * @param {string[]} srcFiles
     * @param {object} data
     */
    getDestinationFiles: function (srcFiles, data) {
        var self = this,
            dstFiles = [],
            path = require('path'),
            srcBase = 'build/scaffolds/' + data.scaffold.task + '/';

        srcFiles.forEach(function (srcPath) {
            var key, match,
                destPath = srcPath.replace(srcBase, '');

            //modules are optional so if no module start at root of scripts, if is module then modules/modulename/
            destPath = destPath.replace('[scaffold.module]', data.scaffold.module || '.');

            while ((match = pathvarrgx.exec(destPath))) {
                with(data) {
                    destPath = destPath.replace(match[0], eval(match[1]));
                }
            }

            dstFiles.push(destPath);
        });

        return dstFiles;
    },

    /**
     * Scans all master stylesheets in same directory
     * as forSheet and adds an import to forSheet to
     * each master stylesheet if one doesn't already exist.
     * @function TemplateEngine#addStyleImport
     * @param forSheet
     */
    addStyleImport: function (forSheet) {
        var self = this,
            dir = path.dirname(forSheet),
            masterSheets = expand({filter: self.isMasterStyleSheet}, dir + '/{.,..}/*');

        masterSheets.forEach(function (toSheet) {
            var relative = path.relative(path.dirname(toSheet), forSheet),
                css = fs.readFileSync(toSheet, {encoding: 'utf8'}),
                match;

            if (self.styleformat !== 'css') {
                relative = relative.replace('.' + self.styleformat, '');
            }

            while ((match = importrgx.exec(css))) {
                if (match[2] === relative) {
                    return;//import already exists
                }
            }

            if (self.styleformat === 'css') {
                css = '@import url("' + relative + '");\n' + css;
            }
            else {
                css = '@import "' + relative + '";\n' + css;
            }

            console.log('creating import to ' + relative + ' in ' + toSheet);
            fs.writeFileSync(toSheet, css, {encoding: 'utf8'});
        });
    },

    /**
     * Scans all master stylesheets in same directory
     * as forSheet and removes an import to forSheet from
     * each master stylesheet if one already exist.
     * @function TemplateEngine#removeStyleImport
     * @param forSheet
     */
    removeStyleImport: function (forSheet) {
        var self = this,
            dir = path.dirname(forSheet),
            masterSheets = expand({filter: self.isMasterStyleSheet}, dir + '/{.,..}/*');

        masterSheets.forEach(function (fromSheet) {
            var relative = path.relative(path.dirname(fromSheet), forSheet),
                css = fs.readFileSync(fromSheet),
                match;

            if (self.styleformat !== 'css') {
                relative = relative.replace('.' + self.styleformat, '');
            }

            while ((match = importrgx.exec(css))) {
                if (match[2] === relative) {
                    css = css.replace(match[0], '');
                    console.log('removing import to ' + relative + ' from ' + fromSheet);
                    fs.writeFileSync(fromSheet, css, {encoding: 'utf8'});
                    break;
                }
            }
        });
    },

    /**
     * Copies contents of templatesDir out to the project root directory in
     * same folder structure as templateDir. Uses keys in data to resolve
     * named parameters and for the lodash temlate for file contents.
     * @function TemplateEngine#create
     */
    create: function () {
        var self = this;
        self.dstFiles.forEach(function (dstPath, index) {
            try {
                console.log(self.srcFiles[index] + ' => ' + dstPath);
                var contents = fs.readFileSync(self.srcFiles[index], {encoding: 'utf8'}),
                    _ = require('lodash'),
                    templateFn = _.template(contents);
                self.context.templateFn = templateFn;  // adding the template itself to the context to enable recursion
                contents = templateFn(self.context);
            } catch (ex) {
                throw ex;
//                return;
            }
            fs.ensureFileSync(dstPath);
            fs.writeFileSync(dstPath, contents, {encoding: 'utf8'});
        });

    },

    /**
     * Removes contents of templatesDir out to the project root directory in
     * same folder structure as templateDir. Uses keys in data to resolve
     * named parameters and for the lodash temlate for file contents.
     * @function TemplateEngine#remove
     */
    remove: function () {
        var self = this;
        self.dstFiles.forEach(function (dstPath) {
            if (fs.existsSync(dstPath)) {
                console.log('removing ' + dstPath);
                fs.unlinkSync(dstPath);
            }
        });
    }
});
