module.exports = function(grunt) {
	grunt.initConfig({
		copy: {
			sources: {
				files: [
					{
						cwd: 'window',
						src: '*',
						dest: 'public/',
						expand: true
					}
				]
			},
			deps: {
				files: [
					{
						cwd: 'node_modules/react/dist',
						src: 'react.min.js',
						dest: 'public/',
						expand: true
					},
					{
						cwd: 'node_modules/react-dom/dist',
						src: 'react-dom.js',
						dest: 'public/',
						expand: true
					},
					{
						cwd: 'static',
						src: '**/*',
						dest: 'public/',
						expand: true
					}
				]
			},
		},

		babel: {
			modules: {
				files: [
					{
						cwd: 'modules',
						src: '**/*',
						dest: 'public/modules/',
						expand: true
					}
				]
			}
		},

		watch: {
			source: {
				files: ['window/*'],
				tasks: ['copy:sources'],
				options: {
					spawn: false
				}
			},
		},

		clean: [
			'public/'
		]
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-babel');

	grunt.registerTask('default', ['copy', 'babel']);
	grunt.registerTask('dist', ['clean', 'copy:main', 'concat', 'ngtemplates', 'css_prefix', 'copy:dist', 'exec:dist', 'compress:dist']);
}
