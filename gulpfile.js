'use strict';

var gulp = require('gulp');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var n2a = require('gulp-native2ascii');
var chug = require( 'gulp-chug' );


var desDir = './build';



gulp.task('prepare', function() {
  return gulp.src(desDir, {read: false})
    .pipe(clean());
});

//
gulp.task('copy', function() {
  return gulp.src(['src/common/adapter.js', 'src/extensions/**/*.js'])
    .pipe(gulp.dest(desDir));
});


//子任务
gulp.task('chug', function () {
  return gulp.src([
      './**/gulpfile.js',
      //除去根目录下的gulpfile.js
      '!./gulpfile.js',
      //除去node_modules目录下的gulpfile.js
      '!./node_modules/**/gulpfile.js'
    ])
    .pipe(chug())
});


//合并js 
gulp.task('seed.js', ['chug'], function(){
  return gulp.src([
      desDir + '/loader.js',
      desDir + '/common.js',
      desDir + '/cookie.js',
      './src/seed.js'
    ]).pipe(concat('seed.js'))
    .pipe(gulp.dest(desDir));
});
gulp.task('bui.js', ['chug'], function(){
  return gulp.src([
      desDir + '/loader.js',
      desDir + '/common.js',
      desDir + '/cookie.js',
      desDir + '/data.js',
      desDir + '/overlay.js',
      desDir + '/list.js',
      desDir + '/picker.js',
      desDir + '/form.js',
      desDir + '/select.js',
      desDir + '/mask.js',
      desDir + '/menu.js',
      desDir + '/tab.js',
      desDir + '/toolbar.js',
      desDir + '/progressbar.js',
      desDir + '/calendar.js',
      desDir + '/editor.js',
      desDir + '/grid.js',
      desDir + '/tree.js',
      desDir + '/tooltip.js',
      './src/all.js'
    ]).pipe(concat('bui.js'))
    .pipe(gulp.dest(desDir));
});


//压缩js
gulp.task('compress.js', ['seed.js', 'bui.js'], function(){
  gulp.src(desDir + '/**/*.js')
    .pipe(uglify({
      output: {
        ascii_only: true
      },
      mangle:{
        except: ['require']
      }
      })
    )
    .pipe(rename({suffix: '-min'}))
    .pipe(gulp.dest(desDir));
});


gulp.task('minify-css', function() {
  gulp.src(desDir + '/**/*.css')
    .pipe(minifyCSS())
    .pipe(rename({suffix: '-min'}))
    .pipe(gulp.dest(desDir));
});

// 默认任务
gulp.task('default', function() {
  // gulp.start('copy', 'compress.js', 'minify-css');
  gulp.start('chug');
});
