module.exports = function (grunt) {

    var config = {
        npmTasks: [
            'grunt-contrib-concat', 'grunt-contrib-uglify', 'grunt-contrib-clean', 'grunt-contrib-copy'
        ],
        customTasks: {
            default: {
                desc: '',
                tasks: ['dev']
            },
            dev: {
                desc: '',
                tasks: ['clean', 'concat', 'copy']
            },
            prod: {
                desc: '',
                tasks: ['clean', 'concat', 'uglify', 'copy']
            }
        }
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: ['build/'],
        concat: {
            dist: {
                src: [
                    'src/js/**/*.js',
                    'src/js/main.js'
                ],
                dest: 'build/js/app.js',
            }
        },
        uglify: {
            build: {
                src: 'build/js/app.js',
                dest: 'build/js/app.js'
            }
        },
        copy: {
            main: {
                expand:true,
                cwd:'src/html',
                src: ['**/*.html'],
                dest: 'build/',
            },
        },

    });

    for (id in config.npmTasks) {
        grunt.loadNpmTasks(config.npmTasks[id]);
    }
    for (id in config.customTasks) {
        grunt.registerTask(id, config.customTasks[id].desc, config.customTasks[id].tasks);
    }
};