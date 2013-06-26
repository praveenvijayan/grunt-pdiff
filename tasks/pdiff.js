/*
 * grunt-compare-shots
 * https://github.com/praveen/compare-shots
 *
 * Copyright (c) 2013 praveenvijayan
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks
  var path = require('path');
  var webshot = require('webshot');
  var exec = require('child_process').exec;
  var fs = require('fs');
  var gm = require('gm');
  var q = require('q');
  // var AdmZip = require('adm-zip');
  var colors = require('colors');

  // console.log(q);
  colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
  });


  grunt.registerMultiTask('pdiff', 'Create and compares web screenshots.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({}),
        done = this.async(),
        counter = 0,
        files = grunt.file.expand(this.filesSrc),
        flen = files.length;
        
        grunt.file.mkdir(options.backupFolder);
        grunt.file.mkdir(options.oldDir);
        options.path = options.path || '',
        options.webshotOpts.streamType = options.webshotOpts.streamType || 'png';

        // console.log(grunt.file.isMatch('*.png', options.dirPath ))

        // Backup files - result and old screenshots
        if(options.backupOld || options.backupResult){
          var readFolder = q.denodeify(fs.readdir);
          readFolder(options.dirPath).then(function(files){
            if(files.length >0){
              createBackUp();
            }
          });
        }else{
          takeScreenShot();
        }

      //Cleans result folder
      function cleanResult (argument) {
        grunt.file.delete(options.resultDir)
        grunt.file.mkdir(options.resultDir);
      }

      //If backup is on 
      function createBackUp (argument) {
        var date = new Date();
        var currentDate = " "+date.getFullYear()+date.getMonth()+date.getDate()+date.getTime();

        if(options.backupOld){
          grunt.file.mkdir(options.backupFolder+currentDate);
          var readFolder = q.denodeify(fs.readdir);
          readFolder(options.oldDir).then(function(files){
            files.forEach(function (val) {
              grunt.file.copy(options.oldDir+val, options.backupFolder+currentDate+"/"+val) 
            })
          }).then(function () {
            swapFiles();
          });
        }

        if(options.backupResult){
          grunt.file.mkdir(options.backupFolder+"result-"+currentDate);
          var readFolderResult = q.denodeify(fs.readdir);
          readFolderResult(options.resultDir).then(function(files){
            files.forEach(function (val) {
              grunt.file.copy(options.resultDir+val, options.backupFolder+"result-"+currentDate+"/"+val) 
            })
          }).then(function () {
            cleanResult();
            swapFiles();
          });

        }

        if(!options.backupOld && !options.backupResult){
          cleanResult();
          swapFiles();
        }

        //Screenshots from new folder to old folder
        function swapFiles () {
          var readSource = q.denodeify(fs.readdir);
          readSource(options.dirPath).then(function(files){
            files.forEach(function (val) {
              grunt.file.copy(options.dirPath+val, options.oldDir+val);
            })
          }).then(function (argument) {
            takeScreenShot();
          });
        }
      
      }

      function takeScreenShot () {
        var fileExt = options.webshotOpts.streamType;

        // files.forEach(function (val, index) {
            // compareTemplate(val)
          var val = files[counter];
            webshot(options.path+"/"+path.basename(val), options.dirPath+path.basename(val)+"."+fileExt, options.webshotOpts ,function(err) {
              console.log("Saved ->"+ options.dirPath+path.basename(val)+"."+fileExt);

              if(!grunt.file.exists(options.oldDir+path.basename(val)+"."+fileExt)){
                grunt.file.copy(options.dirPath+path.basename(val)+"."+fileExt, options.oldDir+path.basename(val)+"."+fileExt)
              }else{
                compareShots(options.dirPath+path.basename(val)+"."+fileExt);
              }
            });
      }

        

    function compareShots (filepath) {
      console.log("Started comparing files...".info)
      gm.compare(filepath, filepath.replace('new','old'), function (err, isEqual, equality, raw) {
          // if (err) return console.log(err);

          // if the images were considered equal, `isEqual` will be true, otherwise, false.
          // console.log('The images were equal: %s', isEqual);

          // to see the total equality returned by graphicsmagick we can inspect the `equality` argument.
          // console.log('Actual equality: %d', equality);

          if(equality){
            var command = [
                'composite',
                '-compose', 'difference',
                // '-gravity', 'center', 
                // '-quality', 100,
                filepath,
                filepath.replace('new','old'),
                options.resultDir+path.basename(filepath)
            ];

            // Join command array by a space character and then execute command
            exec(command.join(' '), function(err, stdout, stderr) {
               console.log("Difference found..".warn)
            });
          }

          if(counter == flen-1){
            done();
          } 
          counter++;
          takeScreenShot();         
        });
    }
  });

};
