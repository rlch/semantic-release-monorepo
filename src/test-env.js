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
  await execa('npm', ['init', '-y'], { cwd: projectRoot });
  await pushAll(gitRoot, `init ${projectName}'`);
  await outputFile(resolve(projectRoot, 'README.md'), 'Read me...');
  await pushAll(gitRoot, 'feat: add README to  ${projectName}');
  monorepoPluginPath &&
    (await applySemRel(gitRoot, projectName, monorepoPluginPath, true));
};

const applySemRel = async (gitRoot, projectName, monorepoPluginPath, noLog) => {
  const projectRoot = resolve(gitRoot, 'projects', projectName);
  const semRel = execa(
    'npx',
    ['semantic-release', '-e', monorepoPluginPath, '--no-ci'],
    { cwd: projectRoot }
  );
  if (!noLog) {
    semRel.stdout.pipe(process.stdout, { end: false });
    semRel.stderr.pipe(process.stderr, { end: false });
  }
  await semRel;
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

const setupSemRelTestEnv = async (projectNames = [], monorepoPluginPath) => {
  const gitRoot = await setupWorkspace();

  for (const projectName of projectNames) {
    await setupProject(gitRoot, projectName, monorepoPluginPath);
  }

  return gitRoot;
};

const setupGitTestEnv = async (projectNames = []) => {
  return await setupSemRelTestEnv(projectNames, undefined);
};

// TODO : split in 3 files -> test-env, npm-test-env, dotnet-test-env
module.exports = {
  createOrigin,
  clone,
  setupWorkspace,
  setupProject,
  applySemRel,
  commitAll,
  pushAll,
  setupGitTestEnv,
  setupSemRelTestEnv,
};
