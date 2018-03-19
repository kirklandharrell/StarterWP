// -------------------
//      Requires
// -------------------


var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if'); 
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');


// --------------------------
//      Development Tasks
// --------------------------

gulp.task('browserSync', function() {
    var files = [
        './style.css',
        './*.php',
        './js/*.js'
    ];
    
    // Initialize BrowserSync with a PHP server.
    browserSync.init(files, {
        proxy: 'localhost'
    });
    
});

// Configure Sass Task to run when the specified .scss files change.
// BrowserSync will also reload the browsers.
gulp.task('sass', function() {
   return gulp.src('scss/**/*.scss') // Get all .scss files
    .pipe(sass()) // Passes it through gulp-sass
    .pipe(gulp.dest('./')) // Outputs it in root folder
    .pipe(browserSync.reload({
       stream: true // Reloading with BrowserSync
   }));
       
});

// Create the default task that can be called using 'gulp'.
// The task will process sass, run browserSync and watch for changes.
gulp.task('default', ['sass', 'browserSync'], function() {
    gulp.watch('scss/**/*.scss', ['sass']);
});


// --------------------------
//     Optimization Tasks
// --------------------------


// Useref PHP
gulp.task('useref-php', function() {
    return gulp.src('./*.php')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify())) // Minify only if JS file
    .pipe(gulpIf('*.css', cssnano())) // Minify only if CSS file
    .pipe(gulp.dest('dist'));
});


// Useref CSS
gulp.task('useref-css', function() {
    return gulp.src('./*.css')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify())) // Minify only if JS file
    .pipe(gulpIf('*.css', cssnano())) // Minify only if CSS file
    .pipe(gulp.dest('dist'));
});


// Useref JS
gulp.task('useref-js', function() {
    return gulp.src('./js/*.js')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify())) // Minify only if JS file
    .pipe(gulpIf('*.css', cssnano())) // Minify only if CSS file
    .pipe(gulp.dest('dist/js'));
});


// Optimizing Images
gulp.task('images', function() {
    return gulp.src('img/**/*.+(png|jpg|gif|svg)')
    .pipe(cache(imagemin([
    imagemin.gifsicle({interlaced: true}),
    imagemin.jpegtran({progressive: true}),
    imagemin.optipng({optimizationLevel: 5}),
    imagemin.svgo({plugins: [{removeViewBox: true}]})
    ], {
    verbose: true
    })))                     
    .pipe(gulp.dest('dist/img'));
});


// Copying Fonts
gulp.task('fonts', function() {
    return gulp.src('fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
});


// Cleaning
gulp.task('clean', function() {
    return del.sync('dist');
});


// Cache Clear
gulp.task('cache:clear', function() {
   return cache.clearAll(); 
});


// --------------------------
//       Build Sequences
// --------------------------


// Delete and Build 'Dist' Folder
gulp.task('build', function(callback) {
    runSequence(
        'clean',
        'sass',
        ['useref-php', 'useref-css', 'useref-js', 'images', 'fonts'],
        callback
    );
});
