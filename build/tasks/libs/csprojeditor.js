var fs = require('fs'),
    _ = require('lodash'),
    contentRegEx = /<Content Include="(.*)"\s?\/>\s*/gm,
    noneRegEx = /<None Include="(.*)"\s?\/>\s*/gm,
    includeRegEx = /Include="(.*)"/;

function readProjectFile(csproj) {
    return fs.readFileSync(csproj, {encoding: 'utf8'});
}

function writeProjectFile(csproj, doc) {
    fs.writeFileSync(csproj, doc, {encoding: 'utf8'});
}

function addProjectFiles(doc, files, deploy) {
    var includes = doc.match(deploy ? contentRegEx : noneRegEx) || [];

    files.forEach(function (file) {
        file = file.split('/').join('\\');

        for (var i = 0; i < includes.length; i++) {
            var include = includeRegEx.exec(includes[i]);
            if (include[1] === file) {
                return;//move to next file, this one already here
            }
        }

        if (!doc.indexOf('<ItemGroup')) {
            console.log('adding ItemGroup');
            doc = doc.replace('</Project>', '  <ItemGroup>\n  </ItemGroup>\n</Project>');
        }

        doc = doc.replace('<ItemGroup>', '<ItemGroup>\n    <' + (deploy ? 'Content' : 'None') + ' Include="' + file + '" />');
    });

    return doc;
}

function removeProjectFiles(doc, files, excludeFiles) {
    var includes = (doc.match(contentRegEx) || []).concat(doc.match(noneRegEx) || []);
    console.log(files.length + ', ' + includes.length);

    files.forEach(function (file) {
        file = file.split('/').join('\\');

        for (var i = 0; i < includes.length; i++) {
            var include = includeRegEx.exec(includes[i]);
            if (include[1].indexOf(file) === 0 && !_.contains(excludeFiles, include[1].split('\\').join('/'))) {
                doc = doc.replace(includes[i], '');
            }
        }
    });

    return doc;
}

module.exports = {

    addProjectFiles: function (csproj, files, deploy) {
        var doc = readProjectFile(csproj),
            added = addProjectFiles(doc, files, deploy);
        if (doc !== added) {
            writeProjectFile(csproj, added);
        }
    },

    removeProjectFiles: function (csproj, files) {
        var doc = readProjectFile(csproj),
            removed = removeProjectFiles(doc, files);
        if (doc !== removed) {
            writeProjectFile(csproj, removed);
        }
    },

    addAndRemoveProjectFiles: function (csproj, adds, removes, deploy) {
        var doc = readProjectFile(csproj),
            removed = removeProjectFiles(doc, removes, adds),
            added = addProjectFiles(removed, adds, deploy);

        if (doc !== added) {
            writeProjectFile(csproj, added);
        }
    }
};