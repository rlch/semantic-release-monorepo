const execa = require('execa');
const { mkdir, outputJson } = require('fs-extra');
const { resolve } = require('path');
const { directory } = require('tempy');

const gitRepoName = 'workspace';

const createOrigin = async () => {
  const originDirectory = resolve(directory(), `${gitRepoName}.git`);
  await execa('git', ['init', '--bare', originDirectory]);
  return originDirectory;
};

const clone = async gitRepoUrl => {
  const gitRoot = resolve(directory(), gitRepoName);
  await execa('git', ['clone', gitRepoUrl, gitRoot]);
  return gitRoot;
};

const commitAll = async (gitRoot, message) => {
  await execa('git', ['add', '-A'], { cwd: gitRoot });
  await execa('git', ['commit', '-m', message], { cwd: gitRoot });
  const { stdout } = await execa('git', ['rev-parse', '--verify', 'HEAD'], {
    cwd: gitRoot,
  });
  return stdout;
};

const pushAll = async (gitRoot, message) => {
  await commitAll(gitRoot, message);
  await execa('git', ['push', 'origin', 'master'], {
    cwd: gitRoot,
  });
};

const applySemRel = async (gitRoot, projectName, monorepoPluginPath) => {
  const projectRoot = resolve(gitRoot, 'projects', projectName);
  return execa(
    'npx',
    ['semantic-release', '-e', monorepoPluginPath, '--no-ci', '--debug'],
    { cwd: projectRoot }
  );
};

// TODO : split in 3 files -> test-env, npm-test-env, dotnet-test-env
module.exports = {
  createOrigin,
  clone,
  commitAll,
  pushAll,
  applySemRel,
};
