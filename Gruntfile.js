module.exports = function (grunt) {

    var config = {
        npmTasks: [
            'grunt-contrib-concat',
            'grunt-contrib-uglify',
            'grunt-contrib-clean',
            'grunt-contrib-copy',
            'grunt-contrib-less',
            'grunt-contrib-imagemin',
            'grunt-contrib-watch',
            'grunt-express',
            'grunt-open',
            'grunt-contrib-csslint',
            'grunt-html',
            'grunt-contrib-jshint',
            'grunt-lesslint',
            'grunt-contrib-htmlmin'
        ],
        customTasks: {
            default: {
                desc: '',
                tasks: ['dev']
            },
            dev: {
                desc: '',
                tasks: ['clean', 'jshint', 'concat', 'lesslint', 'less:dev', 'csslint', 'htmllint', 'copy:html', 'copy:images', 'imagemin', 'express', 'open', 'watch']
            },
            qa: {
                desc: '',
                tasks: ['clean', 'jshint', 'concat', 'lesslint', 'less:dev', 'csslint', 'htmllint', 'copy:html', 'copy:images', 'imagemin']
            },
            prod: {
                desc: '',
                tasks: ['clean', 'concat', 'uglify', 'less:prod', 'htmlmin', 'copy:images', 'imagemin']
            }
        }
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: ['build/'],
        jshint: {
            dist: {
                src: [
                    'src/js/*.js',
                    '!src/js/*.min.js'
                ]
            }
        },
        htmllint: {
            dist: {
                options: {
                    path: false,
                    reportpath: false
                },
                src: [
                    'src/**/*.html',
                    '!src/**/*.min.html'
                ]
            }
        },
        lesslint: {
            src: ['src/less/*.less']
        },
        csslint: {
            // The files that we want to check.
            dist: {
                src: [
                    'build/css/**/*.css', // Include all CSS files in this directory.
                    'build/css/**/!*.min.css' // Exclude any files ending with `.min.css`
                ]
            }
        },
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
                jquery: true,
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
        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    removeComments: true
                },

                files: [{
                    expand: true,
                    cwd: 'src/html',
                    src: ['**/*.html', '!**/*.min.html'],
                    dest: 'build/',
                }]
            }
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
                tasks: ['jshint', 'concat'],
                options: {
                    spawn: false,
                },
            },
            css: {
                files: ['src/less/**/*.less'],
                tasks: ['lesslint', 'less:dev', 'csslint'],
                options: {
                    spawn: false,
                }
            },
            html: {
                files: ['src/html/**/*.html'],
                tasks: ['htmllint', 'copy:html']
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