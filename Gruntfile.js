module.exports = function (grunt) {

    var tasks = {
        npm: [
            'grunt-contrib-concat',
            'grunt-contrib-uglify',
            'grunt-contrib-clean',
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
        deploy: {
            default: [
                'dev'
            ],
            dev: [
                'qa', 'express', 'open', 'watch'
            ],
            qa: {
                init: [
                    'clean'
                ],
                css: [
                    'lesslint', 'less:qa', 'csslint'
                ],
                js: [
                    'jshint', 'concat'
                ],
                html: [
                    'htmllint', 'htmlmin:qa'
                ],
                images: [
                    'imagemin'
                ]
            },
            prod: {
                init: [
                    'clean'
                ],
                css: [
                    'lesslint', 'less:prod'
                ],
                js: [
                    'jshint', 'concat', 'uglify'
                ],
                html: [
                    'htmllint', 'htmlmin:prod'
                ],
                images: [
                    'imagemin'
                ]
            }
        }
    }

    grunt.initConfig({
            config: {
                src: {
                    js: ['src/js/**/*.js'],
                    less: ['src/less/**/*.less'],

                    htmlDir: 'src/html/',
                    htmlFiles: '**/*.html',
                    html: ['<%= config.src.htmlDir %>' + '<%= config.src.htmlFiles %>'],

                    imagesDir: 'src/images/',
                    imagesFiles: '**/*.{png,jpg,gif}',
                    images: ['<%= config.src.imagesDir %>' + '<%= config.src.imagesFiles %>']
                },
                dest: {
                    dir: "build/",
                    images: "build/images",
                    js: "build/js/app.js",
                    css: "build/css/app.css",
                },
                vendor: {
                    js: ['bower_components/jquery/dist/jquery.min.js']
                },
                express: {
                    port: 8280,
                    host: '127.0.0.1'
                }
            },

            clean: {
                build: {
                    src: '<%= config.dest.dir %>'
                }
            },
            jshint: {
                build: {
                    src: '<%= config.src.js %>'
                }
            }
            ,
            htmllint: {
                build: {
                    src: '<%= config.src.html %>'
                }
            }
            ,
            lesslint: {
                build: {
                    src: '<%= config.src.less %>'
                }
            }
            ,
            csslint: {
                build: {
                    src: '<%= config.dest.css %>'
                }
            }
            ,
            concat: {
                build: {
                    src: ['<%= config.src.js %>', '<%= config.vendor.js %>'], dest: '<%= config.dest.js %>',
                }
            }
            ,
            uglify: {
                build: {
                    src: '<%= config.dest.js %>', dest: '<%= config.dest.js %>'
                }
            }
            ,
            htmlmin: {
                qa: {
                    files: [{
                        expand: true,
                        cwd: '<%= config.src.htmlDir %>',
                        src: ['<%= config.src.htmlFiles %>'],
                        dest: '<%= config.dest.dir %>',
                    }]
                }
                ,
                prod: {
                    options: {
                        collapseWhitespace: true, removeComments: true
                    }
                    ,

                    files: [{
                        expand: true,
                        cwd: '<%= config.src.htmlDir %>',
                        src: ['<%= config.src.htmlFiles %>'],
                        dest: '<%= config.dest.dir %>',
                    }]
                }
            }
            ,
            less: {
                qa: {
                    options: {
                        ieCompat: true,
                    }
                    ,
                    src: '<%= config.src.less %>', dest: '<%= config.dest.css %>'
                }
                ,
                prod: {
                    options: {
                        compress: true,
                        ieCompat: true,
                    }
                    ,
                    src: '<%= config.src.less %>', dest: '<%= config.dest.css %>'
                }
            }
            ,
            imagemin: {
                build: {
                    files: [{
                        expand: true,
                        cwd: '<%= config.src.imagesDir %>',
                        src: ['<%= config.src.imagesFiles %>'],
                        dest: '<%= config.dest.images %>'
                    }]
                }
            }
            ,
            watch: {
                options: {
                    livereload: true
                }
                ,
                js: {
                    files: '<%= config.src.js %>', tasks: tasks.deploy.qa.js,
                }
                ,
                css: {
                    files: '<%= config.src.less %>', tasks: tasks.deploy.qa.css
                }
                ,
                html: {
                    files: '<%= config.src.html %>', tasks: tasks.deploy.qa.html
                }
                ,
                images: {
                    files: '<%= config.src.images %>', tasks: tasks.deploy.qa.images
                }
            }
            ,
            express: {
                all: {
                    options: {
                        port: '<%= config.express.port %>',
                        bases: ['<%= config.dest.dir %>'],
                        hostname: '<%= config.express.host %>',
                        livereload: true
                    }
                }
            }
            ,
            open: {
                all: {
                    path: 'http://' + '<%= config.express.host %>' + ':' + '<%= config.express.port %>'
                }
            }
        }
    )

    function generateId(oldId, newId) {
        return !oldId || 0 === oldId.length ? newId : oldId + ":" + newId;
    }

    function registerTask(id, tasks, desc) {
        if (id && tasks && tasks.length > 0) {
            grunt.registerTask(id, tasks, desc);
        }
        return tasks;
    }

    function registerTasks(current, id) {

        if (current.constructor === Array) {
            return registerTask(id, current);
        }
        if (current.constructor === Object && current.tasks) {
            return registerTask(id, current.tasks, current.desc);
        }

        var parentTasks = [];
        for (var prop in current) {
            parentTasks = parentTasks.concat(registerTasks(current[prop], generateId(id, prop)));
        }
        return registerTask(id, parentTasks, current.desc);
    }


    for (id in tasks.npm) {
        grunt.loadNpmTasks(tasks.npm[id]);
    }
    registerTasks(tasks.deploy);
}