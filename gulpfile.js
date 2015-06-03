var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');
var plugins = require('gulp-load-plugins')({
    lazy: false
});
var autoprefixer = require('autoprefixer-core');

gulp.task('copy:normalize', function () {
    return gulp.src('./bower_components/normalize-css/normalize.css')
        .pipe(plugins.rename('normalize.scss'))
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
        .pipe(plugins.rename('.htaccess'))
        .pipe(gulp.dest('./build'));

});
gulp.task('copy', function (done) {
    runSequence(['copy:normalize', 'copy:jquery', 'copy:base', 'copy:htaccess'], done);
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

gulp.task('scripts', function () {
    return gulp.src([
            'bower_components/FitText.js/jquery.fittext.js',
            'bower_components/modernizr/modernizr.js'
        ])
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
    runSequence('clean', ['copy', 'scripts', 'styles'], done);
});

gulp.task('default', ['build']);

gulp.task('deploy', ['build'], function (done) {
    runSequence('gh-pages', done);
});
