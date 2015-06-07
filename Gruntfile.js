module.exports = function (grunt) {

    var config = {
        npmTasks: [
            'grunt-contrib-concat', 'grunt-contrib-uglify', 'grunt-contrib-clean', 'grunt-contrib-copy', 'grunt-contrib-less', 'grunt-contrib-imagemin', 'grunt-contrib-watch', 'grunt-express', 'grunt-open'
        ],
        customTasks: {
            default: {
                desc: '',
                tasks: ['dev']
            },
            dev: {
                desc: '',
                tasks: ['clean', 'concat', 'less:dev', 'copy:html', 'copy:images', 'imagemin', 'express', 'open', 'watch']
            },
            qa: {
                desc: '',
                tasks: ['clean', 'concat', 'less:dev', 'copy:html', 'copy:images', 'imagemin']
            },
            prod: {
                desc: '',
                tasks: ['clean', 'concat', 'uglify', 'less:prod', 'copy:html', 'copy:images', 'imagemin']
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
            html: {
                expand: true,
                cwd: 'src/html',
                src: ['**/*.html'],
                dest: 'build/',
            },
            images: {
                expand: true,
                cwd: 'src/images',
                src: ['**/*.{png,jpg,gif}'],
                dest: 'build/images',
            },
        },
        less: {
            dev: {
                options: {
                    ieCompat: true,
                    paths: ["src/less"]
                },
                files: {"build/css/app.css": "src/less/style.less"}
            },
            prod: {
                options: {
                    compress: true,
                    ieCompat: true,
                    paths: ["src/less"]
                },
                files: {"build/css/app.css": "src/less/style.less"}
            }
        },
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'images/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'build/images/'
                }]
            }
        },
        watch: {
            options: {
                livereload: true
            },
            scripts: {
                files: ['src/js/**/*.js'],
                tasks: ['concat'],
                options: {
                    spawn: false,
                },
            },
            css: {
                files: ['src/less/**/*.less'],
                tasks: ['less:dev'],
                options: {
                    spawn: false,
                }
            },
            html: {
                files: ['src/html/**/*.html'],
                tasks: ['copy:html']
            },
            images: {
                files: ['src/images/**/*.{png,jpg,gif}'],
                tasks: ['imagemin', 'copy:images']
            }
        },
        express: {
            all: {
                options: {
                    port: 8082,
                    bases: ['build'],
                    hostname: "0.0.0.0",
                    livereload: true
                }
            }
        },
        open: {
            all: {
                path: 'http://localhost:8082/index.html'
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