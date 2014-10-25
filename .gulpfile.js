var gulp= require('gulp'),
  crx= require('gulp-crx-e-lance')

gulp.task('crx', function(){
	return gulp
	  .src('*.js')
	  .pipe(crx({dest: 'blinker.crx'}))
	  .pipe(gulp.dest('build'))
})
  
