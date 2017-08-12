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