module.exports = function(grunt) {
  'use strict'

  var fs    = require('fs'),
      path  = require('path'),
      _     = grunt.util._

  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-es6-transpiler')
  grunt.loadNpmTasks('grunt-contrib-less')
  grunt.loadNpmTasks('grunt-contrib-jade')
  grunt.loadNpmTasks('grunt-contrib-watch')

  // Configuring
  grunt.initConfig({
    assetsPath  : 'src',
    destPath    : 'dist',
    buildPath   : 'build'
  })

  grunt.registerTask('init', function(proName) {
    var assPath = path.join(grunt.config('buildPath'), 'demo'),
        dstPath = path.join(grunt.config('assetsPath'), proName)

    if (grunt.file.exists(dstPath)) {
      grunt.log.errorlns('Project ' + proName + ' is already esists.')
      return
    }

    grunt.config('copy.' + proName, {
      cwd     : assPath,
      dest    : dstPath,
      src     : ['**'],
      expand  : true
    })

    grunt.task.run(['copy', 'build:' + proName])
  })

  grunt.registerTask('build', function(proName) {
    var assPath = path.join(grunt.config('assetsPath'), proName),
        dstPath = path.join(grunt.config('destPath'), proName)

    if (!grunt.file.exists(assPath)) {
      return
    }

    grunt.config('clean.' + proName, dstPath)

    grunt.config('es6transpiler.' + proName, {
        dest    : path.join(dstPath, 'scripts'),
        cwd     : path.join(assPath, 'scripts'),
        src     : '*.js',
        expand  : true
    })

    grunt.config('watch.scripts@' + proName, {
      files: [path.join(assPath, 'scripts/*.js')],
      tasks: ['es6transpiler.' + proName]
    })

    grunt.config('less.' + proName, {
        dest    : path.join(dstPath, 'styles'),
        cwd     : path.join(assPath, 'styles'),
        src     : '*.less',
        expand  : true,
        ext     : '.css'
    })

    grunt.config('watch.styles@' + proName, {
      files: [path.join(assPath, 'styles/*.js')],
      tasks: ['less.' + proName]
    })

    grunt.config('jade.' + proName, {
        dest    : path.join(dstPath, 'templates'),
        cwd     : path.join(assPath, 'templates'),
        src     : '*.jade',
        expand  : true,
        ext     : '.html'
    })

    grunt.config('jade.index@' + proName, {
        dest    : path.join(dstPath, 'index.html'),
        src     : path.join(assPath, 'index.jade')
    })

    grunt.config('watch.templates@' + proName, {
      files: [path.join(assPath, 'templates/*.jade'), path.join(assPath, 'index.jade')],
      tasks: ['jade.' + proName, 'jade.index@' + proName]
    })

    grunt.task.run(['clean:' + proName, 'es6transpiler', 'less', 'jade'])
  })

  grunt.registerTask('default', ['build'])
}