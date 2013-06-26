# grunt-pdiff

> compare webpages.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-pdiff --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-pdiff');
```

## The "page-diff" task

### Overview
In your project's Gruntfile, add a section named `page-diff` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  pdiff: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.path
Type: `String`
Default value: `',  '`

Path to your html folder.

#### options.dirPath
Type: `String`
Default value: `'.'`

Path to your screenshot folder.

#### options.resultDir
Type: `String`
Default value: `'.'`

Result directory.

#### options.backupFolder
Type: `String`
Default value: `'.'`

Backup directory.

#### options.oldDir
Type: `String`
Default value: `'.'`

Old screenshot directory.

#### options.backupOld
Type: `Bool`
Default value: `'.'`

True will backup old files.

#### options.backupResult
Type: `Bool`
Default value: `'.'`

True will backup result files.

#### options.webshotOpts
Type: `Obj`
Default value: `'.'`

All webshot options

#####windowSize  
{ width: 1024
, height: 768 }
The dimensions of the browser window. screenSize is an alias for this property.

#####shotSize  
{ width: 'window'
, height: 'window' }
The area of the page document, starting at the upper left corner, to render. Possible values are 'screen', 'all', and a number defining a pixel length. 

'window' causes the length to be set to the length of the window (i.e. the shot displays what is initially visible within the browser window). 

'all' causes the length to be set to the length of the document along the given dimension.
phantomPath 'phantomjs' The location of phantomjs. Webshot tries to use the binary provided by the phantomjs NPM module, and falls back to 'phantomjs' if the module isn't available.

#####phantomConfig {}  
Object with key value pairs corresponding to phantomjs command line options.
userAgent undefined The user-agent string Phantom sends to the requested page. If left unset, the default Phantom user-agent will be used
script  undefined An arbitrary function to be executed on the requested page. The script executes within the page's context and can be used to modify the page before a screenshot is taken.
paperSize undefined When generating a PDF, sets page.paperSize. Some options are documented here: https://github.com/ariya/phantomjs/pull/15 Example: {format: 'A4', orientation: 'portrait'}

#####streamType  
'png' If streaming is used, this designates the file format of the streamed rendering. Possible values are 'png', 'jpg', and 'jpeg'.

#####siteType  
'url' siteType indicates whether the content needs to be requested ('url') or is being provided ('html'). Possible values are 'url' and 'html'.

#####renderDelay 
0 Number of milliseconds to wait after a page loads before taking the screenshot.
timeout 0 Number of milliseconds to wait before killing the phantomjs process and assuming webshotting has failed. (0 is no timeout.)

#####takeShotOnCallback  
false Wait for the web page to signal to webshot when to take the photo using window.callPhantom('takeShot');

### Usage Examples

```js
pdiff: {
    options: {
        // path: 'http://localhost:<%= connect.options.port %>',
        // path: 'http://static.com/assets_html/dev/',
        path: 'file://localhost/Users/praveen/Documents/praveen/works/assets_html/dev/',
        dirPath: "screenshots/new/",
        resultDir:'screenshots/result/',
        backupFolder:'screenshots/bak/',
        oldDir:'screenshots/old/',
        backupOld:false,
        backupResult:false,
        webshotOpts: {
            shotSize: {
                width: 1024,
                height: 'all'
            },
            streamType:'jpg'
            timeout:30000,
            renderDelay:2000,
            takeShotOnCallback:true
        }
    },
    files: {
        src: ['<%= yeoman.app %>/*.html']
    }
},
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
