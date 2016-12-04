/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
import babel from 'gulp-babel';
import del from 'del';
import eslint from 'gulp-eslint';
import gulp from 'gulp';
import webpack from 'webpack-stream';
import flow from 'gulp-flowtype';
import mocha from 'gulp-mocha';

import webpackConfig from './webpack.config.babel';

const paths = {
  allSrcJs: 'src/**/*.js?(x)',
  serverSrcJs: 'src/server/**/*.js?(x)',
  clientSrcJs: 'src/client/**/*.js?(x)',
  allLibTests: 'lib/test/**/*.js',
  gulpFile: './gulpfile.babel.js',
  webpackFile: './webpack.config.babel.js',
  libDir: 'lib',
  distDir: 'dist',
  clientBundle: 'dist/client-bundle.js?(.map)',
  clientEntryPoint: 'src/client/app.jsx',
};

gulp.task('clean', () => del([
  paths.libDir,
  paths.clientBundle,
]));

gulp.task('lint', () => gulp.src([
  paths.allSrcJs,
  paths.gulpFile,
  paths.webpackFile,
])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
  .pipe(flow({ abort: true })));

gulp.task('build', ['lint', 'clean'], () => gulp.src(paths.allSrcJs)
  .pipe(babel())
  .pipe(gulp.dest(paths.libDir)));

gulp.task('test', ['build'], () => {
  gulp.src(paths.allLibTests)
    .pipe(mocha());
});

gulp.task('main', ['test'], () => {
  gulp.src(paths.clientSrcJs)
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(paths.distDir));
});

gulp.task('watch', () => {
  gulp.watch(paths.allSrcJs, ['main']);
});

gulp.task('default', ['watch', 'main']);
