module.exports = function (grunt) {

    var config = {
        npmTasks: [
            'grunt-contrib-concat', 'grunt-contrib-uglify'
        ],
        customTasks: {
            default: {
                desc: '',
                tasks: ['']
            },
            dev: {
                desc: '',
                tasks: ['concat']
            },
            prod: {
                desc: '',
                tasks: ['concat', 'uglify']
            }
        }
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

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
                dest: 'build/js/app.min.js'
            }
        }

    });

    for (id in config.npmTasks) {
        grunt.loadNpmTasks(config.npmTasks[id]);
    }
    for (id in config.customTasks) {
        grunt.registerTask(id, config.customTasks[id].desc, config.customTasks[id].tasks);
    }
};