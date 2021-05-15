const glob = require('glob-promise');
const { resolve } = require('path');

const getProjectRoot = async () =>
  resolve((await glob('*.csproj', { absolute: true }))[0], '..');

const getProjectName = async () =>
  (await glob('*.csproj'))[0].slice(0, -'.csproj'.length);

module.exports = {
  getProjectRoot,
  getProjectName,
};
