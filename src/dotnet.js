const { getProjectRoot, getProjectName } = require('./dotnet-pkg-info');
const plugin = require('./plugin');

module.exports = await plugin(getProjectRoot, getProjectName);
