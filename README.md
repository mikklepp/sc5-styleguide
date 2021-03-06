# SC5 Styleguide generator
[![Build Status](https://travis-ci.org/SC5/sc5-styleguide.svg?branch=master)](https://travis-ci.org/SC5/sc5-styleguide) [![dependencies](https://david-dm.org/SC5/sc5-styleguide.png)](https://david-dm.org/SC5/sc5-styleguide)

Styleguide generator is a handy little tool that helps you generate good looking
styleguides from stylesheets using KSS notation. Styleguide generator can be
used via command line utility, gulp task or grunt task (needs grunt-gulp) with minimal effort.

## Table of contents

* [Usage](#usage)
  * [As a command line tool](#as-a-command-line-tool)
  * [As a module in your project](#as-a-module-in-your-project)
  * [With Gulp](#with-gulp)
  * [With Grunt](#with-grunt)
  * [Build options](#build-options)
* [Documenting syntax](#documenting-syntax)
  * [Wrapper markup](#wrapper-markup)
* [Designer tool](#designer-tool)
* [Demo](#demo)

## Usage

You should familiarize yourself with both [KSS](https://github.com/kneath/kss)
and [node-kss](https://github.com/kss-node/kss-node) to get yourself started.

SC5 Styleguide provides additions to KSS syntax which you can learn [below](#user-content-documenting-syntax).

### As a command line tool

Styleline command line tool searches all *.css, *.scss and *.less files from source directory and generates stand-alone styleguide to output path. You can host styleguide files yourself with any HTTP server or start built-in web server.

Installing as a global command line tool

    npm install -g sc5-styleguide

Using from the command line

    styleguide -s <source_path> -o <output_path> [-c <config_file>] [--server] [--watch]

**-s, --source**

Source directory of stylesheets

**-o, --output**

Target directory of the generated styleguide

**-c, --config**

Optional JSON config file to be used when building the styleguide

**--server**

Start minimal web-server to host the styleguide from the output directory

**--port**

Port in which the server will run

**--watch**

Automatically generate styleguide on file change. `--watch` does not run server. Combile with `--server` if you want to run server


Config JSON file could contain following settings

    {
        title: "My Styleguide",
        "overviewPath": "<path to your overview.md>",
        "extraHead": [
            "<link rel=\"stylesheet\" type=\"text/css\" href=\"your/custom/style.css\">",
            "<script src=\"your/custom/script.js\"></script>"
        ]
    }

For more specific documentation. See [Build options](#build-options) section.

### As a module in your project

    npm install sc5-styleguide --save-dev

### With Gulp

    var styleguide = require("sc5-styleguide");

    gulp.task("styleguide", function() {
      return gulp.src(["**/*.css", "**/*.scss", "**/*.less"])
        .pipe(styleguide({
            title: "My Styleguide",
            overviewPath: "<path to your overview.md>",
            extraHead: [
                "<link rel=\"stylesheet\" type=\"text/css\" href=\"your/custom/style.css\">",
                "<script src=\"your/custom/script.js\"></script>"
            ],
            sass: {
                // Options passed to gulp-sass
            },
            less: {
                // Options passed to gulp-less
            }
          }))
        .pipe(gulp.dest("<destination path>"));
    });

For more specific documentation. See [Build options](#build-options) section.

### With Grunt

For Grunt-using projects you need to use `grunt-gulp` bridge:

    npm install grunt-gulp --save-dev

Then you are able to use the same gulp task inside you `Gruntfile`:

    var gulp = require('gulp'),
      styleguide = require('sc5-styleguide');

    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      gulp: {
        styleguide: function() {
          return gulp.src(["**/*.css", "**/*.scss", "**/*.less"])
            .pipe(styleguide({
                title: "My Styleguide",
                overviewPath: "<path to your overview.md>",
                extraHead: [
                    "<link rel=\"stylesheet\" type=\"text/css\" href=\"your/custom/style.css\">",
                    "<script src=\"your/custom/script.js\"></script>"
                ],
                sass: {
                    // Options passed to gulp-ruby-sass
                }
              }))
            .pipe(gulp.dest("<destination path>"));
        }
      }
    });

    grunt.loadNpmTasks('grunt-gulp');

    grunt.registerTask('default', ['gulp']);

For more specific documentation. See next section.

### Build options

The gulp function and configuration JSON accepts identically named parameters

**title** (string, optional)

This string is used as a page title and in the page header

**extraHead** (array or string, optional)

These HTML elements are injected inside the styleguide head-tag.

**sass** (object, optional)

Options passed to gulp-sass. You can define `sass.src` if you want to define which files are passed to the sass compiler (default is *.scss).

**less** (object, optional)

Options passed to gulp-less. You can define `less.src` if you want to define which files are passed to the sass compiler (default is *.scss).

**commonClass** (array or string, optional)

This class is added to all preview blocks in the generated styleguide. If your styles have some namespace class that needs to be added to every block and you do not want to add it to every example you can use commonClass option.

**server** (boolean, optional)

Enable built-in web-server. To enable Desiger tools styleguide must be server with built-in web-server. Server has also ability to refresh changed styles or KSS markup without doing the full page reload.

**port** (number, optional)

Port of the server. Default is 3000.

**rootPath** (string, optional)

Server root path. This must be defined if you run built-in server via gulp or grunt task. Point to the same path as styleguide output folder.

**appRoot** (string, optional)

Define `appRoot` parameter if you host styleguide in other than root folder of the HTTP serve. If
styleguide is hosted in http://example.com/styleguide the appRoot should point to `styleguide`

When using the build as a subfolder of your application, tune your server to resolve all the paths into subfolder. This
will let Angular application to deal with routing itself. However, the static files should be resolved as they are
stored.

**styleVariables** (string, optional)

Path to the file containing SASS variables that can be used as modifiers in the KSS notation.

**filesConfig** (array, optional) **(Experimental feature)**

Configuration array containing paths to the dependencies of the hosted application

    filesConfig: [
      {
        "name": "NameOfMainAppModule",
        "files": [
          "path/to/dependency-file.js",
          "path/to/application-file.js",
          "path/to/stylesheet.css",
        ],
        "template": "path/to/template-filename.html"
      }
    ]

Note: When using templateUrl in directives, the template path is relative to styleguide index.html, not the hosted application root.

## Documenting syntax

Document your CSS components with [KSS](http://warpspire.com/kss/)

### Wrapper markup

Sometimes your component examples need a wrapper. For example:
* you need to show how to use `<li>` element which works only with `<ul>` container;
* your component is not visible with white background;
* your comnponent needs a container with a predefined height.

You can cover such cases by adding a wrapper to a component markup. The wrapper should go after the example in
markup:

```
// markup:
//  <li>
//    <a class="{$modifiers}">Item</a>
//  </li>
// <sg:wrapper>
// <nav class="sg side-nav">
//  <ul>
//   <sg:wrapper-content/>
//  </ul>
// </nav>
// </sg:wrapper>
```

Here a piece of markup between `<sg:wrapper>` and `</sg:wrapper>` tags is a wrapper. The `<sg:wrapper-content/>`
inside shows where to place an example.

Wrappers can be used for fixes like this:

```
// markup:
//  <div class="my-component">This is a white compoennt</div>
// <sg:wrapper>
// <div style="background-color: grey;">
//   <sg:wrapper-content/>
// </div>
// </sg:wrapper>
```

The modifiers get the same wrapper as their parent section.

**Wrappers are inheritable.** A wrapper of a parent section is inherited by its children sections. This meain that such
a KSS markup

```
// Parent section
//
// markup:
// <div class="parent"></div>
// <sg:wrapper>
// <div class="parent-wrapper">
//  <sg:wrapper-content/>
// </div>
//
// Styleguide 1.0

...

// Child section
//
// markup:
// <span class="child"></span>
// <sg:wrapper>
// <div class="parent">
//  <sg:wrapper-content/>
// </div>
//
// Styleguide 1.1
```

would produce a Parent section:
 ```
<div class="parent-wrapper">
  <div class="parent"></div>
</div>
```
and a Child section:
```
<div class="parent-wrapper">
  <div class="parent">
    <span class="child"></span>
  </div>
</div>
```

## Designer tool

When sassVariables is defined and styleguide is served with the built-in server, designer tool is also enabled. Designer tool is experimental feature that allow style variable editing in the browser and saving changed variables back to the source file.

## Demo

Build demo styleguide and start a server on port 3000

    npm run demo

Note: If you installed styleguide by cloning repository directly instead of npm you need to run `npm run build` first

The demo generates styleguide to `demo-output` directory.

Point your browser to <http://localhost:3000>
