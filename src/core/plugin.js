const { compose } = require('ramda');
const { wrapStep } = require('semantic-release-plugin-decorators');

const logPluginVersion = require('./log-plugin-version');
const withOnlyPackageCommits = require('./only-package-commits');
const versionToGitTag = require('./version-to-git-tag');

const {
  mapNextReleaseVersion,
  withOptionsTransforms,
} = require('./options-transforms');

const analyzeCommits = (getProjectRoot, getProjectName) =>
  wrapStep(
    'analyzeCommits',
    compose(
      logPluginVersion('analyzeCommits'),
      withOnlyPackageCommits(getProjectRoot, getProjectName)
    ),
    {
      wrapperName: 'semantic-release-monorepo',
    }
  );

const generateNotes = (getProjectRoot, getProjectName) =>
  wrapStep(
    'generateNotes',
    compose(
      logPluginVersion('generateNotes'),
      withOnlyPackageCommits(getProjectRoot, getProjectName),
      withOptionsTransforms([
        mapNextReleaseVersion(versionToGitTag(getProjectName)),
      ])
    ),
    {
      wrapperName: 'semantic-release-monorepo',
    }
  );

const success = (getProjectRoot, getProjectName) =>
  wrapStep(
    'success',
    compose(
      logPluginVersion('success'),
      withOnlyPackageCommits(getProjectRoot, getProjectName),
      withOptionsTransforms([
        mapNextReleaseVersion(versionToGitTag(getProjectName)),
      ])
    ),
    {
      wrapperName: 'semantic-release-monorepo',
    }
  );

const fail = (getProjectRoot, getProjectName) =>
  wrapStep(
    'fail',
    compose(
      logPluginVersion('fail'),
      withOnlyPackageCommits(getProjectRoot, getProjectName),
      withOptionsTransforms([
        mapNextReleaseVersion(versionToGitTag(getProjectName)),
      ])
    ),
    {
      wrapperName: 'semantic-release-monorepo',
    }
  );

module.exports = (getProjectRoot, getProjectName, getProjectNameSync) => ({
  analyzeCommits: analyzeCommits(getProjectRoot, getProjectName),
  generateNotes: generateNotes(getProjectRoot, getProjectName),
  success: success(getProjectRoot, getProjectName),
  fail: fail(getProjectRoot, getProjectName),
  tagFormat: getProjectNameSync() + '-v${version}',
});
