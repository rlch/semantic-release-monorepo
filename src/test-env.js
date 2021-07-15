const execa = require('execa');
const { mkdir, outputFile, outputJson } = require('fs-extra');
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
  await pushAll(gitRoot, 'init workspace');

  return gitRoot;
};

const setupProject = async (gitRoot, projectName, monorepoPluginPath) => {
  const projectRoot = resolve(gitRoot, 'projects', projectName);
  await mkdir(projectRoot, { recursive: true });
  await chdirPreserveCwd(projectRoot, async () => {
    await execa('npm', ['init', '-y']);
  });
  await pushAll(gitRoot, `init ${projectName}'`);
  await outputFile(resolve(projectRoot, 'README.md'), 'Read me...');
  await pushAll(gitRoot, 'feat: add README to  ${projectName}');
  await applySemRel(gitRoot, projectName, monorepoPluginPath, true);
};

const applySemRel = async (gitRoot, projectName, monorepoPluginPath, noLog) => {
  const projectRoot = resolve(gitRoot, 'projects', projectName);
  await chdirPreserveCwd(projectRoot, async () => {
    const semRel = execa('npx', [
      'semantic-release',
      '-e',
      monorepoPluginPath,
      '--no-ci',
    ]);
    if (!noLog) {
      semRel.stdout.pipe(process.stdout, { end: false });
      semRel.stderr.pipe(process.stderr, { end: false });
    }
    await semRel;
  });
};

const commitAll = async (gitRoot, message) => {
  await chdirPreserveCwd(gitRoot, async () => {
    await execa('git', ['add', '-A']);
    await execa('git', ['commit', '-m', message]);
  });
};

const pushAll = async (gitRoot, message) => {
  await commitAll(gitRoot, message);

  await chdirPreserveCwd(gitRoot, async () => {
    await execa('git', ['push', 'origin', 'master']);
  });
};

const setupTestEnv = async monorepoPluginPath => {
  const gitRoot = await setupWorkspace();
  await setupProject(gitRoot, 'project1', monorepoPluginPath);
  await setupProject(gitRoot, 'project2', monorepoPluginPath);

  return gitRoot;
};

const chdirPreserveCwd = async (targetDirectory, myFunction) => {
  const cwd = process.cwd();
  process.chdir(targetDirectory);
  await myFunction();
  process.chdir(cwd);
};

module.exports = {
  createOrigin,
  clone,
  setupWorkspace,
  setupProject,
  applySemRel,
  commitAll,
  pushAll,
  setupTestEnv,
  chdirPreserveCwd,
};
