module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {

      all: {
        files: ['dev/views/index.html'],
        options: {
          
        }
      },

      js: {
        files: ['dev/js/**', 'app/**/*.js', 'server.js'],
        tasks: ['jshint'],
        options: {
          
        }
      },

      html: {
        files: ['dev/views/**'],
        options: {
          
        }
      },

      compass: {
        files: ['dev/sass/*.scss','dev/sass/*.sass'],
        tasks: ['compass:server'],
        options: {
          
        }
      },

      css: {
        files: ['app/css/*.css'],
        options: {
          
        }
      },

      livereload: {
        options: { livereload: true },
        files: [
          'dev/views/index.html',
          'dev/js/**',
          'app/**/*.js',
          'app/views/**',
          'dev/sass/*.scss',
          'dev/sass/*.sass',
          'dev/css/*.css'
        ]
      }

    },

    jshint: {
      all: [
        'gruntfile.js',
        'server.js',
        'app/**/*.js',
        'config/*.js',
        'dev/js/**/*.js'
      ]
    },

    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src:['dev/js/**/*.js'],
        dest: 'tmp/<%= pkg.name %>.js'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - <%= pkg.author %> - <%= grunt.template.today("dd-mm-yyyy") %>*/\n'
      },
      dist: {
        files: {
          'release/app/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },

    compass: {
      options: {
        sassDir: 'dev/sass',
        cssDir: 'dev/css'
      },
      dist: {},
      server: {
        options: {
          debugInfo: true
        }
      }
    },

    cssmin: {
      options: {
        banner: '/*! <%= pkg.name %> - <%= pkg.author %> - <%= grunt.template.today("dd-mm-yyyy") %>*/\n',
        report: 'min',
        keepSpecialComments: 1
      },
      dist: {
        files: {
          'dist/app/css/<%= pkg.name %>.min.css': [
            'dev/css/styles.css'
          ]
        }
      }
    },

    nodemon: {
      dev: {
        script: 'dev/server.js'
      }
    },

    open: {
      all: {
        path: 'http://localhost:3000'
      }
    },

    concurrent: {
      tasks: [
        'nodemon',
        //'watch',
        'open'//,
        //'compass:server'
      ],
      options: {
        logConcurrentOutput: true
      }
    }

  });


  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.registerTask('default', ['concurrent']);
  //grunt.registerTask('build', ['jshint', 'concat', 'uglify', 'compass', 'cssmin']);
  //grunt.registerTask('test', ['mochaTest']);
};