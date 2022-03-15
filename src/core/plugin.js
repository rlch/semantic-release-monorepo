const SemanticReleaseError = require('@semantic-release/error');
const { cosmiconfigSync } = require('cosmiconfig');
const { compose } = require('ramda');
const { wrapStep } = require('@rlch/semantic-release-plugin-decorators');

const logPluginVersion = require('./log-plugin-version');
const withOnlyPackageCommits = require('./only-package-commits');
const versionToGitTag = require('./version-to-git-tag');

const {
  mapNextReleaseVersion,
  withOptionsTransforms,
} = require('./options-transforms');

const analyzeCommits = (getProjectRoot, getProjectName, getProjectVersion) =>
  wrapStep(
    'analyzeCommits',
    compose(
      logPluginVersion('analyzeCommits', getProjectVersion),
      withOnlyPackageCommits(getProjectRoot, getProjectName)
    ),
    {
      wrapperName: 'semantic-release-monorepo',
    }
  );

const generateNotes = (getProjectRoot, getProjectName, getProjectVersion) =>
  wrapStep(
    'generateNotes',
    compose(
      logPluginVersion('generateNotes', getProjectVersion),
      withOnlyPackageCommits(getProjectRoot, getProjectName),
      withOptionsTransforms([
        mapNextReleaseVersion(versionToGitTag(getProjectName)),
      ])
    ),
    {
      wrapperName: 'semantic-release-monorepo',
    }
  );

const success = (getProjectRoot, getProjectName, getProjectVersion) =>
  wrapStep(
    'success',
    compose(
      logPluginVersion('success', getProjectVersion),
      withOnlyPackageCommits(getProjectRoot, getProjectName),
      withOptionsTransforms([
        mapNextReleaseVersion(versionToGitTag(getProjectName)),
      ])
    ),
    {
      wrapperName: 'semantic-release-monorepo',
    }
  );

const fail = (getProjectRoot, getProjectName, getProjectVersion) =>
  wrapStep(
    'fail',
    compose(
      logPluginVersion('fail', getProjectVersion),
      withOnlyPackageCommits(getProjectRoot, getProjectName),
      withOptionsTransforms([
        mapNextReleaseVersion(versionToGitTag(getProjectName)),
      ])
    ),
    {
      wrapperName: 'semantic-release-monorepo',
    }
  );

const missingFunction = fnName => {
  return new SemanticReleaseError(
    `Mising function ${fnName} from config.pkgInfo`,
    'PKG_INFO_MISSING_FUNCTION',
    'semantic-release config.pkgInfo missing a function'
  );
};

const CONFIG_NAME = 'release';
module.exports = (
  getProjectRoot,
  getProjectName,
  getProjectNameSync,
  getProjectVersion
) => {
  const pkgInfo = {
    ...cosmiconfigSync(CONFIG_NAME).search(process.cwd()).config.pkgInfo,
  };
  if (Object.entries(pkgInfo).length > 0) {
    const assignFn = fnName => {
      if (pkgInfo[fnName]) {
        return pkgInfo[fnName];
      }
      throw missingFunction(fnName);
    };
    getProjectRoot = assignFn('getProjectRoot');
    getProjectName = assignFn('getProjectName');
    getProjectNameSync = assignFn('getProjectNameSync');
    getProjectVersion = assignFn('getProjectVersion');
  }
  return {
    analyzeCommits: analyzeCommits(
      getProjectRoot,
      getProjectName,
      getProjectVersion
    ),
    generateNotes: generateNotes(
      getProjectRoot,
      getProjectName,
      getProjectVersion
    ),
    success: success(getProjectRoot, getProjectName, getProjectVersion),
    fail: fail(getProjectRoot, getProjectName, getProjectVersion),
    tagFormat: getProjectNameSync() + '-v${version}',
  };
};
