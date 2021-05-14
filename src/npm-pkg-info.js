const pkgUp = require('pkg-up');
const readPkg = require('read-pkg');
const { resolve } = require('path');

const getProjectRoot = async () => resolve(await pkgUp(), '..');

const getProjectName = async () => (await readPkg()).name;

module.exports = {
  getProjectRoot,
  getProjectName,
};
