var gulp = require('gulp');

var sass = require('gulp-sass');

var server = require('gulp-webserver');

gulp.task('devSass',function(){
	return gulp.src('./src/scss/*.scss')
	.pipe(sass())
	.pipe(gulp.dest('./src/css'))
})

gulp.task('watch',function(){
	return gulp.watch('./src/scss/*.scss',gulp.series('devSass'))
})

gulp.task('devServer',function(){
	return gulp.src('src')
	.pipe(server({
		port:8787,
		proxies:[
			{
				source:'/api/getList',target:'http://localhost:3000/api/getList'
			},
			{
				source:'/api/del',target:'http://localhost:3000/api/del'
			}
		]
	}))
})

gulp.task('dev',gulp.series('devSass','devServer','watch'))