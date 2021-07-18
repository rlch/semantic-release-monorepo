const glob = require('glob-promise');
const { resolve } = require('path');
const SemanticReleaseError = require('@semantic-release/error');

const getProjectRoot = async cwd => {
  cwd = cwd || process.cwd();

  const csprojPath = (await glob('*.csproj', { absolute: true, cwd }))[0];

  if (csprojPath) {
    return resolve(csprojPath, '..');
  }

  throw new SemanticReleaseError(
    'No .csproj file',
    'NO_CSPROJ',
    'semantic-release should be ran in an individual monorepo package with a .csproj file'
  );
};

const getProjectName = async cwd => {
  cwd = cwd || process.cwd();

  const csprojFile = (await glob('*.csproj', { cwd }))[0];

  if (csprojFile) {
    return csprojFile.slice(0, -'.csproj'.length);
  }

  throw new SemanticReleaseError(
    'No .csproj file',
    'NO_CSPROJ',
    'semantic-release should be ran in an individual monorepo package with a .csproj file'
  );
};

const getProjectNameSync = cwd => {
  cwd = cwd || process.cwd();

  const csprojFile = glob.sync('*.csproj', { cwd })[0];

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
  getProjectNameSync,
};
