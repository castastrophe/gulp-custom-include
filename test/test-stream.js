var array = require('stream-array');
var File = require('vinyl');

module.exports = function () {
    var args = Array.prototype.slice.call(arguments);

    var i = 0;

    function create(contents) {
        return new File({
            // cwd: '',
            // base: './test/fixtures/',
            // path: './test/fixtures/file' + (i++).toString() + '.js',
            contents: new Buffer(contents),
            stat: {
                mode: 0666
            }
        });
    }

    return array(args.map(create))
};