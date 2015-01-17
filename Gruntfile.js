module.exports = function (grunt) {
    grunt.initConfig({
        uglify: {
            main: {
                files: [{
                    src: 'bower_components/FitText.js/jquery.fittext.js',
                    dest: 'build/js/fittext.min.js'
                }, {
                    src: 'bower_components/modernizr/modernizr.js',
                    dest: 'build/js/modernizr.min.js'
                }]
            }
        },
        copy: {
            main: {
                files: [{
                    src: 'bower_components/jquery/jquery.min.js',
                    dest: 'build/js/jquery.min.js'
                }, {
                    src: 'bower_components/normalize-css/normalize.css',
                    dest: 'sass/_normalize.scss'
                }, {
                    src: ['*.html', 'robots.txt', 'favicon.*', 'CNAME'],
                    dest: 'build/'
                }, {
                    src: 'a.htaccess',
                    dest: 'build/.htaccess'
                }]
            }
        },
        sass: {
            main: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'build/css/main.css': 'sass/main.scss'
                }
            }
        },
        'gh-pages': {
            options: {
                base: 'build',
                dotfiles: true
            },
            src: '**/*'
        },
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-gh-pages');

    grunt.registerTask('default', ['copy', 'uglify', 'sass']);
    grunt.registerTask('deploy', ['default', 'gh-pages']);
};
