const path = require('path');
const fs = require('fs');

/**
 * @typedef {object} FilePath

 * @property {string} path
 * @property {string} dir
 * @property {string} filename
 * @property {string} name
 */

/**
 * @param {string} startPath
 * @param {string} endsWith
 *
 * @return {FilePath[]}
 */
function getFilesPaths(startPath, endsWith) {
  /**
   * @type {FilePath[]}
   */
  let array = [];

  if (!fs.existsSync(startPath)) {
    throw new Error('no dir ', startPath);
  }

  const files = fs.readdirSync(startPath);

  for (let i = 0; i < files.length; i += 1) {
    const fullFileName = path.join(startPath, files[i]);
    const stat = fs.lstatSync(fullFileName);

    if (stat.isDirectory()) {
      array = [...array, ...getFilesPaths(fullFileName, endsWith)];
    } else if (fullFileName.endsWith(endsWith)) {
      array.push({
        path: fullFileName,
        dir: path.dirname(fullFileName),
        filename: path.basename(fullFileName),
        name: path.basename(fullFileName).replace(endsWith, ''),
      });
    }
  }

  return array;
}

module.exports = {
  getFilesPaths,
};
