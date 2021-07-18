const { outputFile } = require('fs-extra');
const { resolve } = require('path');
const { commitAll, applySemRel, setupSemRelTestEnv } = require('./test-env');
const execa = require('execa');

describe('npm', () => {
  const semanticReleaseMonorepo = process.cwd();
  const npmPlugin = resolve(semanticReleaseMonorepo, 'src', 'npm');

  beforeEach(async () => {
    process.env.Path += ';C:\\Program Files\\Git\\mingw64\\bin';
  });

  // To fix 'git-upload-pack: command not found' error on Windows, add 'C:\\Program Files\\Git\\mingw64\\bin' to PATH environment variable
  it('gets package.json file path', async () => {
    const gitRoot = await setupSemRelTestEnv(['project1'], npmPlugin);

    const project1Root = resolve(gitRoot, 'projects', 'project1');
    await outputFile(resolve(project1Root, 'file1.txt'), 'content1');

    await commitAll(gitRoot, 'fix: file1');

    await applySemRel(gitRoot, 'project1', npmPlugin, true);

    // TODO : expect nouvelle version
  }, 30000);
});
