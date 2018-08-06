/*
 * PROJECT: gulp-include
 * URL: https://github.com/castastrophe/gulp-include/
 * GNU GPL v3.0 License
 */

'use strict';

const fs = require('fs');
const glob = require('glob');
const through = require('through2');
var PluginError = require('gulp-util').PluginError;
const path = require('path');

const PLUGIN_NAME = 'gulp-include';

/**
 * Foo description
 * @module gulp-include
 * @param {obj} options - The user's configurations
 */
module.exports = user_opts => {

    const regexSafe = string => string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");

    // Read in the options, set the defaults
    let options = {
        // No source or dist defaults
        src: '',
        dist: '',
        includes: [],
        // Standard prefix is //@ but can be customized by the user
        prefix: '//@',
        // Allow user to pass in their own keyword
        // Default allows for include or replace
        keyword: '(?:include|replace)',
        // Allow user to pass in their own custom regex
        // Default looks for the filename inside parenthesis with or without spaces or quotations
        regex: '\\([\\s\'\"]*([a-z\.]*)[\\s\'\"]*\\)'
    };

    // Combine the options object with the user inputs
    Object.assign(options, user_opts);

    // Create a regex safe prefix
    let prefix = regexSafe(options.prefix);

    // Build the regular expression for capturing the file name
    let include = new RegExp(prefix + options.keyword + options.regex, 'g');

    return through.obj(function (file, encoding, callback) {

        // Check that the file exists and is not empty
        if (file.isNull()) {
            // return callback(null, file);
            return callback(null);
        }

        // Return error if stream provided
        if (file.isStream()) {
            // file.contents is a Stream - https://nodejs.org/api/stream.html
            this.emit('error', new PluginError(PLUGIN_NAME, PLUGIN_NAME + ': Streams not supported'));
            return callback(null, file);
        }

        // Get file contents & path
        let base = path.join(file.cwd, options.src);
        let root = file.cwd;
        // let requireList = []
        let currentPath = path.relative(base, file.base).replace(/\\/g, '/').replace(/^(..*)$/, '$1/');

        // let filename = file.path.replace(file.base, '');
        // let currentFile = path.join(currentPath, filename).replace(/\\/g, '/');
        let result = file.contents.toString();

        while (result.match(include)) {
            result = result.replace(include, function (full, match) {

                // Find the matched file
                let includeBase = path.join(file.cwd, options.dist);
                // The current directory is a fallback if no include paths are found
                let includePath = path.join(includeBase, currentPath);
                // Check if the file exists in the include paths provided by the user
                options.includes.forEach((p, idx) => {

                    if (fs.existsSync(path.join(base, p, match))) {

                        includePath = path.join(base, p) + '/';
                    }
                });


                return glob.sync(includePath + match.replace(/\'|\"/g, '')).map(function (val) {

                    return fs.readFileSync(val).toString();
                }).join('');
            });
        }



        file.contents = new Buffer(result);

        // this.push(file);
        callback(null, file);
    });

};