const execa = require('execa');
const { mkdir, outputJson } = require('fs-extra');
const { resolve } = require('path');

const { createOrigin, clone, pushAll } = require('./test-env');

const gitRepoName = 'workspace';

const setupWorkspace = async () => {
  const originDirectory = await createOrigin();
  const gitRepoUrl = `file://${originDirectory}`;
  const gitRoot = await clone(gitRepoUrl);

  await outputJson(resolve(gitRoot, 'package.json'), {
    name: gitRepoName,
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

const setupProject = async (gitRoot, projectName) => {
  const projectRoot = resolve(gitRoot, 'projects', projectName);
  await mkdir(projectRoot, { recursive: true });
  await execa('npm', ['init', '-y'], { cwd: projectRoot });
  await pushAll(gitRoot, `chore: init ${projectName}'`);
};

const setupTestEnv = async (projectNames = []) => {
  const gitRoot = await setupWorkspace();

  for (const projectName of projectNames) {
    await setupProject(gitRoot, projectName);
  }

  return gitRoot;
};

// TODO : split in 3 files -> test-env, npm-test-env, dotnet-test-env
module.exports = {
  setupWorkspace,
  setupProject,
  setupTestEnv,
};
