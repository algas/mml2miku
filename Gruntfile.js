module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-mocha-phantomjs');
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
        }
    });
    grunt.registerTask('build', ['typescript']);
    grunt.registerTask('test', ['mocha_phantomjs']);
};
