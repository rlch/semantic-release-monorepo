const pkgUp = require('pkg-up');
const readPkg = require('read-pkg');
const { resolve } = require('path');
const SemanticReleaseError = require('@semantic-release/error');

const getProjectRoot = async () => {
  const pkgPath = await pkgUp();

  if (pkgPath) {
    if (resolve(pkgPath, '..') === process.cwd()) {
      return process.cwd();
    }
  }

  throw new SemanticReleaseError(
    'No package.json file',
    'NO_PACKAGE_JSON',
    'semantic-release should be ran in an individual monorepo package with a package.json file'
  );
};

const getProjectName = async () => {
  try {
    return (await readPkg()).name;
  } catch {
    throw new SemanticReleaseError(
      'No package.json file',
      'NO_PACKAGE_JSON',
      'semantic-release should be ran in an individual monorepo package with a package.json file'
    );
  }
};

const getProjectNameSync = () => {
  try {
    return readPkg.sync().name;
  } catch {
    throw new SemanticReleaseError(
      'No package.json file',
      'NO_PACKAGE_JSON',
      'semantic-release should be ran in an individual monorepo package with a package.json file'
    );
  }
};

module.exports = {
  getProjectRoot,
  getProjectName,
  getProjectNameSync,
};
