const execa = require('execa');
const { mkdir, outputJson } = require('fs-extra');
const { resolve } = require('path');

const { createOrigin, clone, pushAll, applySemRel } = require('./common');

const setupNpmWorkspace = async () => {
  const originDirectory = await createOrigin();
  const gitRepoUrl = `file://${originDirectory}`;
  const gitRoot = await clone(gitRepoUrl);

  await outputJson(resolve(gitRoot, 'package.json'), {
    name: 'test-workspace',
    version: '0.0.0',
    repository: {
      type: 'git',
      url: gitRepoUrl,
    },
  });
  await outputJson(resolve(gitRoot, '.releaserc.json'), {
    plugins: [
      '@semantic-release/commit-analyzer',
      '@semantic-release/release-notes-generator',
    ],
  });
  await pushAll(gitRoot, 'chore: init workspace');

  return gitRoot;
};

const setupNpmProject = async (gitRoot, projectName) => {
  const projectRoot = resolve(gitRoot, 'projects', projectName);
  await mkdir(projectRoot, { recursive: true });
  await execa('npm', ['init', '-y'], { cwd: projectRoot });
  await pushAll(gitRoot, `chore: init ${projectName}'`);
};

const setupNpmTestEnv = async (projectNames = []) => {
  const gitRoot = await setupNpmWorkspace();

  for (const projectName of projectNames) {
    await setupNpmProject(gitRoot, projectName);
  }

  return gitRoot;
};

const getNpmProjectRoot = (gitRoot, projectName) => {
  return resolve(gitRoot, 'projects', projectName);
};

module.exports = {
  setupNpmWorkspace,
  setupNpmProject,
  setupNpmTestEnv,
  getNpmProjectRoot,
};
