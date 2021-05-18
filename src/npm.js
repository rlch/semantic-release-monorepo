const {
  getProjectRoot,
  getProjectName,
  getProjectNameSync,
} = require('./npm-pkg-info');
const plugin = require('./core/plugin');

module.exports = plugin(getProjectRoot, getProjectName, getProjectNameSync);
