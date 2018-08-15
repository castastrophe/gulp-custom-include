# gulp-custom-include

> Gulp plugin for including files

The include plugin searches the provided file for a standardized format and if found, gets the content of the provided file and injects into the original at that location.

## Installation

Install package with NPM and add it to your development dependencies:

`npm install --save-dev gulp-custom-include`

## Information

<table>
<tr>
<td>Package</td><td>gulp-custom-include</td>
</tr>
<tr>
<td>Description</td>
<td>Include files into others using a standardized syntax</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 0.10</td>
</tr>
</table>

## Usage

```js
var include = require("gulp-custom-include");

gulp.task("scripts", function() {
    return gulp
        .src("foo.js")
        .pipe(include())
        .pipe(gulp.dest("./dist/"));
});
```

**foo.js**

```js
//@include(bar.js)
```

## API

Returns a stream with the included content injected into the Vinyl files.

### `include([opts])`

#### opts.src

Type: `String`

A string of the root path in which to look for the included file. If this is blank, it will default to the file's source location.

```js
var include = require("gulp-custom-include");

gulp.task("scripts", function() {
    return gulp
        .src("./path/*.js")
        .pipe(
            include({
                src: "./custom/path",
                includes: ["js/includes", "includes"],
            }),
        )
        .pipe(gulp.dest("./dist/"));
});
```

#### opts.includes

Type: `Array`

An array of paths to search for the included file; default is empty. If the array is empty, the script will search for the file relative to it's source file.

```js
var include = require("gulp-custom-include");

gulp.task("scripts", function() {
    return gulp
        .src("./path/*.js")
        .pipe(
            include({
                includes: ["js/includes", "includes"],
            }),
        )
        .pipe(gulp.dest("./dist/"));
});
```

#### opts.prefix

Type: `String`

A way to optionally customize the prefix that triggers the include; default is `//@`.

```js
var include = require("gulp-custom-include");

gulp.task("scripts", function() {
    return gulp
        .src("foo.js")
        .pipe(
            include({
                prefix: "//--",
            }),
        )
        .pipe(gulp.dest("./dist/"));
});
```

**foo.js**

```js
//--include(bar.js)
```

#### opts.keyword

Type: `String`

A way to optionally customize the keyword that triggers the include; default allows for either `include` or `replace`.

```js
var include = require("gulp-custom-include");

gulp.task("scripts", function() {
    return gulp
        .src("foo.js")
        .pipe(
            include({
                keyword: "inject",
            }),
        )
        .pipe(gulp.dest("./dist/"));
});
```

**foo.js**

```js
//@inject(bar.js)
```

#### opts.regex

Type: `String`

A way to optionally customize the regex which facilitates the capturing of the filename from the include string. This parses everything that appears after the prefix and the keyword; default is: `\\([\\s\'\"]*([a-z\.]*)[\\s\'\"]*\\)`.

```js
var include = require("gulp-custom-include");

gulp.task("scripts", function() {
    return gulp
        .src("foo.js")
        .pipe(
            include({
                regex: ":[\\s'\"]*([a-z.]*)[\\s'\"]*",
            }),
        )
        .pipe(gulp.dest("./dist/"));
});
```

**foo.js**

```js
//@include: bar.js
```

#### opts.unique

Type: `Boolean`

This value is true if a file should be included only one per source file and false if it is allowed to be included more than once; default is `true`.

```js
var include = require("gulp-custom-include");

gulp.task("scripts", function() {
    return gulp
        .src("./path/*.js")
        .pipe(
            include({
                includes: ["js/includes", "includes"],
                unique: false,
            }),
        )
        .pipe(gulp.dest("./dist/"));
});
```
