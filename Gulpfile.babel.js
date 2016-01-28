import gulp from 'gulp';
import babel from 'gulp-babel';
import clean from 'gulp-clean';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';

gulp.task('clean', () => {
    let read = false;

    return gulp.src('dist/*.js', { read }).
        pipe(clean());
});

gulp.task('babel', ['clean'], () => {
    return gulp.src('src/*.babel.js').
        pipe(babel()).
        pipe(rename((path) => { path.basename = path.basename.replace('.babel', '') })).
        pipe(gulp.dest('dist'));
});

gulp.task('compress', ['clean', 'babel'], () => {
    return gulp.src('dist/*.js').
        pipe(uglify()).
        pipe(rename((path) => { path.basename = `${path.basename}.min` })).
        pipe(gulp.dest('dist'));
});

gulp.task('build', ['clean', 'babel', 'compress']);
gulp.task('default', ['build']);
