const { getProjectRoot, getProjectName } = require('./npm-pkg-info');
const plugin = require('./plugin');

module.exports = await plugin(getProjectRoot, getProjectName);
