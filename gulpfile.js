const gulp = require('gulp');
const nunjucks = require('gulp-nunjucks');
const sass = require('gulp-sass')(require('sass'));
const babel = require('gulp-babel');
const browsersync = require('browser-sync').create();
const data = require('gulp-data');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const size = require('gulp-size');
const newer = require('gulp-newer');
const del = require('del');

const libsPath = [
  './node_modules/@fancyapps/ui/dist/fancybox.umd.js',
  './node_modules/swiper/swiper-bundle.js',
  './node_modules/micromodal/dist/micromodal.js',
];

const paths = {
  html: {
    src: ['src/*.html'],
    dest: './dist/'
  },
  nunjucks: {
    src: ['src/*.njk'],
    dest: './dist/'
  },
  styles: {
    src: ['src/styles/*.sass', 'src/styles/index.scss', 'src/styles/*.css'],
    dest: './dist/css/'
  },
  scripts: {
    src: ['src/scripts/**/*.js'],
    dest: './dist/js/'
  },
  images: {
    src: 'src/images/**',
    dest: './dist/images/'
  },
  data: {
    src: './src/data/data.json'
  }
}

const clean = () => {
  return del(['dist/*', '!dist/img'])
}

const nunjuck = () => {
  return gulp.src(paths.nunjucks.src)
    .pipe(data(function() { 
      return require(paths.data.src);
    }))
    .pipe(nunjucks.compile())
    .pipe(size({
      showFiles:true
    }))
    .pipe(gulp.dest(paths.nunjucks.dest))
    .pipe(browsersync.stream());
}

const styles = () => {
  return gulp.src(paths.styles.src)
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({
    cascade: false
  }))
  .pipe(rename({
    basename: 'style',
  }))
  .pipe(gulp.dest(paths.styles.dest))
  .pipe(cleanCSS({
    level: 2
  }))
  .pipe(rename({
    basename: 'style',
    suffix: '.min'
  }))
  .pipe(sourcemaps.write('.'))
  .pipe(size({
    showFiles:true
  }))
  .pipe(gulp.dest(paths.styles.dest))
  .pipe(browsersync.stream())
}

const scripts = () => {
  return gulp.src(paths.scripts.src)
  .pipe(sourcemaps.init())
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(uglify())
  .pipe(concat('main.min.js'))
  .pipe(sourcemaps.write('.'))
  .pipe(size({
    showFiles:true
  }))
  .pipe(gulp.dest(paths.scripts.dest))
  .pipe(browsersync.stream())
}

const jsLibs = () => {
  return gulp.src(libsPath)
  .pipe(uglify())
  .pipe(concat('libs.min.js'))
  .pipe(size({
    showFiles:true
  }))
  .pipe(gulp.dest(paths.scripts.dest))
  .pipe(browsersync.stream());
}

const images = () => {
  return gulp.src(paths.images.src)
  .pipe(newer(paths.images.dest))
  .pipe(imagemin({
    progressive: true
  }))
  .pipe(size({
    showFiles:true
  }))
  .pipe(gulp.dest(paths.images.dest))
}

const watch = () => {
  browsersync.init({
    server: {
        baseDir: "./dist",
        index: "index.html"
    }
  })
  gulp.watch('dist/*.html').on('change', browsersync.reload)
  gulp.watch(paths.nunjucks.src, nunjuck)
  gulp.watch(paths.styles.src, styles)
  gulp.watch(paths.scripts.src, scripts)
  gulp.watch(paths.images.src, images)
}

exports.clean = clean
exports.styles = styles
exports.nunjuck = nunjuck
exports.scripts = scripts
exports.libs = jsLibs
exports.images = images
exports.watch = watch

exports.default = gulp.series(clean, nunjuck, gulp.parallel(styles, scripts, jsLibs, images), watch)