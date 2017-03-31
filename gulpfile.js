var autoprefixer = require('autoprefixer-core');
var del = require('del');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({ lazy: false });
var runSequence = require('run-sequence');

var mySite = 'http://www.giladpeleg.com';

gulp.task('copy:normalize', function () {
    return gulp.src('./node_modules/normalize-css/normalize.css')
        .pipe(plugins.rename('normalize.scss'))
        .pipe(gulp.dest('./src/sass'));
});

gulp.task('copy:base', function () {
    return gulp.src('./src/{*.html,robots.txt,favicon.*,CNAME}')
        .pipe(gulp.dest('./build'));
});

gulp.task('copy:htaccess', function () {
    return gulp.src('./src/a.htaccess')
        .pipe(plugins.rename('.htaccess'))
        .pipe(gulp.dest('./build'));

});
gulp.task('copy', function (done) {
    runSequence(['copy:normalize', 'copy:base', 'copy:htaccess'], done);
});

gulp.task('styles', ['copy'], function () {
    return gulp.src('./src/sass/main.scss')
        .pipe(plugins.sass())
        .pipe(plugins.postcss([
            autoprefixer({
                browsers: ['last 3 versions', 'ie >= 8', '> 1%', 'Safari >= 6'],
                cascade: false
            })
        ]))
        .pipe(plugins.minifyCss({
            rebase: false,
            aggressiveMerging: false
        }))
        .pipe(gulp.dest('./build/css'));
});

gulp.task('clean', function (done) {
    del('./build', done);
});

gulp.task('sitemap', function () {
    return gulp.src('./src/*.html')
        .pipe(plugins.sitemap({
            siteUrl: mySite
        }))
        .pipe(gulp.dest('./build'));
});

gulp.task('scripts', function () {
    return gulp.src(['./node_modules/fittext.js/jquery.fittext.js'])
        .pipe(plugins.uglify())
        .pipe(gulp.dest('./build/js'));
});

gulp.task('gh-pages', function () {
    return gulp.src('./build/**/*')
        .pipe(plugins.ghPages({
            push: true
        }));
});

gulp.task('build', function (done) {
    runSequence('clean', ['copy', 'scripts', 'styles', 'sitemap'], done);
});

gulp.task('default', ['build']);

gulp.task('deploy', ['build'], function (done) {
    runSequence('gh-pages', done);
});
