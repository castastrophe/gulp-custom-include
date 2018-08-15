/*
 * PROJECT: gulp-custom-include
 * URL: https://github.com/castastrophe/gulp-custom-include/
 * GNU GPL v3.0 License
 */

'use strict';

const fs = require('fs');
const glob = require('glob');
const through = require('through2');
const PluginError = require('plugin-error');
const log = require('fancy-log');
const path = require('path');

const PLUGIN_NAME = 'gulp-custom-include';

/**
 * Foo description
 * @module gulp-custom-include
 * @param {obj} options - The user's configurations
 */
module.exports = user_opts => {

    const regexSafe = string => string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    let found = [];

    // Read in the options, set the defaults
    let options = {
        // No source or dist defaults
        src: '',
        includes: [],
        // Standard prefix is //@ but can be customized by the user
        prefix: '//@',
        // Allow user to pass in their own keyword
        // Default allows for include or replace
        keyword: '(?:include|replace)',
        // Allow user to pass in their own custom regex
        // Default looks for the filename inside parenthesis with or without spaces or quotations
        regex: '\\([\\s\'\"]*([a-z-\.]*)[\\s\'\"]*\\)',
        unique: true
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
            callback(null, file);
            return;
        }

        // Return error if stream provided
        if (file.isStream()) {
            // file.contents is a Stream - https://nodejs.org/api/stream.html
            callback(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return;
        }

        // If
        if (!options.src) {
            options.src = file.cwd;
        }
        // Get file contents & path
        let currentPath = path.relative(options.src, file.base).replace(/\\/g, '/').replace(/^(..*)$/, '$1/');
        let result = file.contents.toString();

        // Find the matched file
        // The current directory is a fallback if no include paths are found
        let includePath = path.join(options.src, currentPath);

        while (result.match(include)) {
            result = result.replace(include, (full, match) => {

                // Check if the file exists in the include paths provided by the user
                options.includes.forEach((p, idx) => {
                    if (fs.existsSync(path.join(options.src, p, match))) {
                        includePath = path.join(options.src, p) + '/';
                    }
                });

                if ((options.unique && found.indexOf(match) < 0) || !options.unique) {
                    found.push(match);
                    // log.info(match + " included");
                    return glob.sync(includePath + match.replace(/\'|\"/g, '')).map(function (val) {
                        return fs.readFileSync(val).toString();
                    }).join('');
                } else {
                    // log.info(match + " was duplicate");
                    // Return an empty string if the include is already done
                    return glob.sync(includePath + match.replace(/\'|\"/g, '')).map(function (val) {
                        return '// ' + match + ' was already included';
                    }).join('');
                }
            });
        }

        file.contents = new Buffer(result);
        callback(null, file);
    });
};