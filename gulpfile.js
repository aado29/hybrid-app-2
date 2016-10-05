var gulp = require('gulp');
var gutil = require('gulp-util');
var browserSync = require('browser-sync').create();
var historyApiFallback = require('connect-history-api-fallback');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var paths = {
  // sass: ['./scss/**/*.scss'],
  sass: [],
  js: []
};
// === DEFAULT TASK
gulp.task('default', ['serve']);
// Static Server + watching scss/html files
gulp.task('serve', ['sass', 'compressJs'], function() {
  browserSync.instance = browserSync.init({
    startPath: '/index.html',
    server: {
      baseDir: "./www",
      middleware: [
        historyApiFallback()
      ]
    },
    port: 8100
  });
  // === WATCH
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js, ['compressJs', browserSync.reload]);
  gutil.log(gutil.colors.red('\n\n•••••••••••••••••••••••••••••••••••••\n'), gutil.colors.yellow('  SERVER RUNNING...'), gutil.colors.red('\n•••••••••••••••••••••••••••••••••••••\n\n'));
  // gulp.watch("www/**/*").on('change', browserSync.reload);
});
// === COMPILE TASKS
gulp.task('sass', function () {
  return gulp.src(paths.sass)
    .pipe(concat('style.scss'))
    .pipe(sass({
      outputStyle: 'compressed',
      errLogToConsole: true 
    }))
    .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(browserSync.stream())
    .on('error', sass.logError);
});
gulp.task('compressJs', function () {
  return gulp.src(paths.js)
    .pipe(ngAnnotate())
    .pipe(concat('./app.min.js'))
    .pipe(uglify({mangle: true}))
    .pipe(gulp.dest('./www/js'));
});
gulp.task('build', ['sass', 'compressJs']);