var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');
var $ = require('gulp-load-plugins')({
    lazy: false
});

gulp.task('copy:normalize', function () {
    return gulp.src('./bower_components/normalize-css/normalize.css')
        .pipe($.rename('normalize.scss'))
        .pipe(gulp.dest('./src/sass'));
});

gulp.task('copy:jquery', function () {
    return gulp.src('./bower_components/jquery/dist/jquery.min.{map,js}')
        .pipe(gulp.dest('./build/js'));
});

gulp.task('copy:base', function () {
    return gulp.src('./src/{*.html,robots.txt,favicon.*,CNAME}')
        .pipe(gulp.dest('./build'));
});

gulp.task('copy:htaccess', function () {
    return gulp.src('./src/a.htaccess')
        .pipe($.rename('.htaccess'))
        .pipe(gulp.dest('./build'));

});
gulp.task('copy', function (done) {
    runSequence(['copy:normalize', 'copy:jquery', 'copy:base', 'copy:htaccess'], done);
});

gulp.task('styles', ['copy'], function () {
    return gulp.src('./src/sass/main.scss')
        .pipe($.sass())
        .pipe($.autoprefixer('last 2 versions'))
        .pipe($.minifyCss())
        .pipe(gulp.dest('./build/css'));
});

gulp.task('clean', function (done) {
    del('./build', done);
});

gulp.task('scripts', function () {
    return gulp.src([
            'bower_components/FitText.js/jquery.fittext.js',
            'bower_components/modernizr/modernizr.js'
        ])
        .pipe($.uglify())
        .pipe(gulp.dest('./build/js'));
});

gulp.task('gh-pages', function () {
    return gulp.src('./build/**/*')
        .pipe($.ghPages({
            push: true
        }));
});

gulp.task('build', function (done) {
    runSequence('clean', ['copy', 'scripts', 'styles'], done);
});

gulp.task('default', function (done) {
    runSequence('build', done);
});

gulp.task('deploy', ['build'], function (done) {
    runSequence('gh-pages', done);
});
