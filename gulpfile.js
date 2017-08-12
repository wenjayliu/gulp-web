//gulpfile.js
/*首先在全局上加载gulp，这个很重要*/
const gulp = require('gulp');
/*在全局上定义项目的目录结构，供应后面使用*/
const dirs = {
  dist:'./dist',
  src: './src',
  css: './src/css',
  less: './src/less',
  js: './src/js',
  img: './src/img',
};
gulp.task('create-directory', () => {
  const mkdirp = require('mkdirp'); //这里要依赖mkdirp这个包，已通过cnpm package.json安装
  for (let i in dirs) {
    mkdirp(dirs[i], err => {
      err ? console.log(err) : console.log('mkdir-->' + dirs[i]);;
    });
  }
});
//在终端运行cnpm run gulp create-directory

/*全局定义要处理的文件*/
const files = {
  lessFiles: './src/less/go.less',
  cssFiles: './src/css/*.css',
  jsFiles: './src/js/*.js',
  imgFiles:'./src/img/*.*'
}
//编译less
gulp.task('compile-less', () => {
const less = require('gulp-less'); //依赖gulp-less的插件
const notify = require('gulp-notify'); 
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create(); //browser-sync同步服务器
const reload = browserSync.reload; //将browser-sync的reload方法存起来，方便调用
  return gulp.src(files.lessFiles)
  .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })) //使用gulp-notify和gulp-plumber用来阻止因为less语法写错跳出监视程序发生
  .pipe(less())
  .pipe(gulp.dest(dirs.css + '/'))
  .pipe(reload({stream: true}));
});

// 本地服务器功能，自动刷新（开发环境）
gulp.task('server', ['compile-less'],()=>{
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
  browserSync.init({
    server: './'
  });
  gulp.watch(dirs.less+'/**/*.less', ['compile-less']); //监视less文件夹中的所有less文件，有改动就调用compile-less任务编译less
  gulp.watch('./*.html').on('change', reload); //监视html文件，有改动就刷新浏览器
  gulp.watch(dirs.js+'/**/*.js').on('change', reload); //监视所有js文件有改动就刷新浏览器
});
//在cmd运行cnpm run gulp server

//添加浏览器私有前缀（生产环境）
gulp.task('autoprefixer', () => {
  const postcss = require('gulp-postcss');
  const sourcemaps = require('gulp-sourcemaps');
  const autoprefixer = require('autoprefixer');
  return gulp.src(files.cssFiles)
    .pipe(sourcemaps.init()) //添加sourcemap,方便调试
    .pipe(postcss([ autoprefixer() ])) //添加浏览器私有前缀，解决浏览器的兼容问题
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dirs.css+'/'))
});