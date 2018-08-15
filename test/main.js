var include = require('../');

var should = require('should');
var fs = require('fs');
var path = require('path');
var assert = require('stream-assert');
var test = require('./test-stream');
var File = require('vinyl');
var gulp = require('gulp');

require('mocha');

let fixtures = glob => {
    return path.join(__dirname, 'fixtures', glob);
}

describe('gulp-custom-include', () => {

    describe('include()', () => {
        it('should ignore null files', done => {
            var stream = include('test.js');
            stream
                // .pipe(assert.length(0))
                .pipe(assert.end(done));
            stream.write(new File());
            stream.end();
        });

        it('should emit error on streamed file', done => {
            gulp.src(fixtures('*'), {
                    buffer: false
                })
                .pipe(include('test.js'))
                .once('error', err => {
                    err.message.should.eql('gulp-custom-include: Streaming not supported');
                    done();
                });
        });
    });

    describe('should not fail to include file', () => {

        it('when the filename is inside parenthesis', done => {
            test('//@include(include.js)')
                .pipe(include({
                    includes: [
                        '/test/fixtures'
                    ]
                }))
                .pipe(assert.length(1))
                .pipe(assert.first(d => {
                    d.contents.toString().should.eql('// Successfully included');
                }))
                .pipe(assert.end(done));
        });

        it('when the filename uses double quotes', done => {
            test('//@include("include.js")')
                .pipe(include({
                    includes: [
                        '/test/fixtures'
                    ]
                }))
                .pipe(assert.length(1))
                .pipe(assert.first(d => {
                    d.contents.toString().should.eql('// Successfully included');
                }))
                .pipe(assert.end(done));
        });

        it('when the filename uses single quotes', done => {
            test('//@include(\'include.js\')')
                .pipe(include({
                    includes: [
                        '/test/fixtures'
                    ]
                }))
                .pipe(assert.length(1))
                .pipe(assert.first(d => {
                    d.contents.toString().should.eql('// Successfully included');
                }))
                .pipe(assert.end(done));
        });

        it('when the filename has whitespace', done => {
            test('//@include(  include.js  )')
                .pipe(include({
                    includes: [
                        '/test/fixtures'
                    ]
                }))
                .pipe(assert.length(1))
                .pipe(assert.first(d => {
                    d.contents.toString().should.eql('// Successfully included');
                }))
                .pipe(assert.end(done));
        });

        it('when the filename has tabs', done => {
            test('//@include(\tinclude.js\t)')
                .pipe(include({
                    includes: [
                        '/test/fixtures'
                    ]
                }))
                .pipe(assert.length(1))
                .pipe(assert.first(d => {
                    d.contents.toString().should.eql('// Successfully included');
                }))
                .pipe(assert.end(done));
        });

    });

    describe('user-defined options should include the file succesfully', () => {

        it('when the include prefix is customized', done => {
            test('//--include(include.js)')
                .pipe(include({
                    prefix: '//--',
                    includes: [
                        '/test/fixtures'
                    ]
                }))
                .pipe(assert.length(1))
                .pipe(assert.first(d => {
                    d.contents.toString().should.eql('// Successfully included');
                }))
                .pipe(assert.end(done));
        });

        it('when the include keyword is customized', done => {
            test('//@inject(include.js)')
                .pipe(include({
                    keyword: 'inject',
                    includes: [
                        '/test/fixtures'
                    ]
                }))
                .pipe(assert.length(1))
                .pipe(assert.first(d => {
                    d.contents.toString().should.eql('// Successfully included');
                }))
                .pipe(assert.end(done));
        });

        it('when the include regex is customized', done => {
            test('//@include: include.js ')
                .pipe(include({
                    regex: ':[\\s\'\"]*([a-z\.]*)[\\s\'\"]*',
                    includes: [
                        '/test/fixtures'
                    ]
                }))
                .pipe(assert.length(1))
                .pipe(assert.first(d => {
                    d.contents.toString().should.eql('// Successfully included');
                }))
                .pipe(assert.end(done));
        });

    });

    describe('should fail to include file', () => {

        it('when the include keyword is malformed', done => {
            test('//@inject(include.js)')
                .pipe(include({
                    includes: [
                        '/test/fixtures'
                    ]
                }))
                .pipe(assert.length(1))
                .pipe(assert.first(d => {
                    d.contents.toString().should.not.eql('// Successfully included');
                }))
                .pipe(assert.end(done));
        });

        it('when the include format is malformed', done => {
            test('//@include: include.js ')
                .pipe(include({
                    includes: [
                        '/test/fixtures'
                    ]
                }))
                .pipe(assert.length(1))
                .pipe(assert.first(d => {
                    d.contents.toString().should.not.eql('// Successfully included');
                }))
                .pipe(assert.end(done));
        });

    });

    describe('should not fail if no files were input', () => {

        it('when argument is a string', done => {
            var stream = include('test.js');
            stream.end();
            done();
        });

        it('when argument is an object', done => {
            var stream = include({
                path: 'new.txt'
            });
            stream.end();
            done();
        });

    });

});