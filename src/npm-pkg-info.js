const pkgUp = require('pkg-up');
const readPkg = require('read-pkg');
const { resolve } = require('path');
const SemanticReleaseError = require('@semantic-release/error');

const getProjectRoot = async cwd => {
  cwd = cwd || process.cwd();

  const pkgPath = await pkgUp(cwd);

  if (pkgPath) {
    if (resolve(pkgPath, '..') === cwd) {
      return cwd;
    }
  }

  throw new SemanticReleaseError(
    'No package.json file',
    'NO_PACKAGE_JSON',
    'semantic-release should be ran in an individual monorepo package with a package.json file'
  );
};

const getProjectName = async cwd => {
  cwd = cwd || process.cwd();

  try {
    return (await readPkg({ cwd })).name;
  } catch {
    throw new SemanticReleaseError(
      'No package.json file',
      'NO_PACKAGE_JSON',
      'semantic-release should be ran in an individual monorepo package with a package.json file'
    );
  }
};

const getProjectNameSync = cwd => {
  cwd = cwd || process.cwd();

  try {
    return readPkg.sync({ cwd }).name;
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
