const { src, dest } = require('gulp');

function copyTemplates(cb) {
  src('./src/_templates/**/*').pipe(dest('./out/_templates'));
  cb();
}

exports.default = copyTemplates;
