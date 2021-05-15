const { getProjectRoot, getProjectName } = require('./npm-pkg-info');
const plugin = require('./core/plugin');

module.exports = await plugin(getProjectRoot, getProjectName);
