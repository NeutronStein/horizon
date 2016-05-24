'use strict';

const { basename, resolve } = require('path');
const fs = require('fs');

const validProjectName = /^[A-Za-z0-9_]+$/;
const fixableProjectName = /^[A-Za-z0-9_-]+$/;
const unfixableChars = /[^A-Za-z0-9_-]/g;

function pathExists(pathName) {
  try {
    fs.accessSync(pathName);
    return true;
  } catch (e) {
    return false;
  }
}

function dehyphenate(name) {
  return name.replace(/-/g, '_');
}

function checkProjectName(prospectiveName) {
  let chdirTo = prospectiveName;
  if (prospectiveName === '.' || prospectiveName == null) {
    // eslint-disable-next-line no-param-reassign
    prospectiveName = basename(resolve('.'));
    chdirTo = '.';
  }
  if (validProjectName.test(prospectiveName)) {
    return {
      dirName: prospectiveName,
      projectName: prospectiveName,
      chdirTo,
    };
  } else if (fixableProjectName.test(prospectiveName)) {
    return {
      dirName: prospectiveName,
      projectName: dehyphenate(prospectiveName),
      chdirTo,
    };
  } else {
    const invalids = prospectiveName.match(unfixableChars).join('');
    throw new Error(invalids);
  }
}

module.exports = checkProjectName;
