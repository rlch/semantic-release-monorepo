const glob = require('glob-promise');
const { resolve } = require('path');
const SemanticReleaseError = require('@semantic-release/error');

const getProjectRoot = async () => {
  const csprojPath = (await glob('*.csproj', { absolute: true }))[0];

  if (csprojPath) {
    return resolve(csprojPath, '..');
  }

  throw new SemanticReleaseError(
    'No .csproj file',
    'NO_CSPROJ',
    'semantic-release should be ran in an individual monorepo package with a .csproj file'
  );
};

const getProjectName = async () => {
  const csprojFile = (await glob('*.csproj'))[0];

  if (csprojFile) {
    return csprojFile.slice(0, -'.csproj'.length);
  }

  throw new SemanticReleaseError(
    'No .csproj file',
    'NO_CSPROJ',
    'semantic-release should be ran in an individual monorepo package with a .csproj file'
  );
};

module.exports = {
  getProjectRoot,
  getProjectName,
};
