const plugin = require('./core/plugin');
const {
  getProjectRoot,
  getProjectName,
  getProjectNameSync,
} = require('./dotnet-pkg-info');

module.exports = plugin(getProjectRoot, getProjectName, getProjectNameSync);
