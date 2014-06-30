module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-mocha-phantomjs');
    grunt.loadNpmTasks('grunt-este-watch');
    grunt.initConfig({
        typescript: {
            main: {
                src: ['src/mml2miku.ts'],
                dest: 'js/mml2miku.js',
                options: {
                    comments: true,
                    // target: 'es5',
                }
            },
            test: {
                src: ['tests/testmml2miku.ts'],
                // dest: 'tests/testmml2miku.js',
                options: {
                    module: 'commonjs',
                    comments: true,
                    // target: 'es5',
                }
            }
        },
        mocha_phantomjs: {
            all: ['test.html']
        },
        esteWatch: {
            options: {
                dirs: ['src', 'tests']
            },
            livereload: {
                'enabled': 'false'
            },
            'ts': function(filepath) {
                return ['typescript:main', 'typescript:test', 'mocha_phantomjs:all'];
            }
        }
    });
    grunt.registerTask('build', ['typescript']);
    grunt.registerTask('test', ['mocha_phantomjs']);
    grunt.registerTask('server', ['esteWatch']);
};
