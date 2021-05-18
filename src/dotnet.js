const {
  getProjectRoot,
  getProjectName,
  getProjectNameSync,
} = require('./dotnet-pkg-info');
const plugin = require('./core/plugin');

module.exports = plugin(getProjectRoot, getProjectName, getProjectNameSync);
