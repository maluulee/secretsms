var gulp = require('gulp'),
watch = require('gulp-watch'),
postCss = require('gulp-postcss'),
webpack = require('webpack'),
browserSync = require('browser-sync').create(),
autoprefixer = require('autoprefixer'),
cssImport = require('postcss-import'),
nested = require('postcss-nested'),
cssVars = require('postcss-simple-vars'),
mixins = require('postcss-mixins'),
hexrgba = require('postcss-hexrgba');


gulp.task('watch', function() {
	browserSync.init({
		notify: false,
		server: {
			baseDir: "app"
		}
	})

	watch('app/index.html', function() {
		browserSync.reload();
	})

	watch('app/assets/styles/**/*.css', function() {
		gulp.start('cssInject');
	})

	watch('app/assets/scripts/**/*.js', function() {
		gulp.start('scriptReload')
	})
})


gulp.task('styles', function() {
	return gulp.src('app/assets/styles/styles.css')
	.pipe(postCss([cssImport, mixins, nested, cssVars, hexrgba, autoprefixer]))
	.on('error', function(e) {
		console.log(e.toString());
		this.emit('end');
	})
	.pipe(gulp.dest('app/temp/styles'))
})

gulp.task('cssInject', ['styles'], function() {
	return gulp.src('app/temp/styles/styles.css')
	.pipe(browserSync.stream());
})

gulp.task('scripts', function(callback) {
	webpack(require('./webpack.config.js'), function(err, stats) {
		if(err) {
			console.log(err.toString());
		}
		console.log(stats.toString());
		callback();
	})
})

gulp.task('scriptReload', ['scripts'], function() {
	browserSync.reload();
})