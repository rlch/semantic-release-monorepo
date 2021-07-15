const { outputFile } = require('fs-extra');
const { resolve } = require('path');
const { commitAll, applySemRel, setupTestEnv } = require('./test-env');

describe('npm', () => {
  const semanticReleaseMonorepo = process.cwd();
  const npmPlugin = resolve(semanticReleaseMonorepo, 'src', 'npm');

  // To fix command not found error (git-upload-pack) on Windows, add C:\\Program Files\\Git\\mingw64\\bin to PATH environment variable
  it('gets package.json file path', async () => {
    const gitRoot = await setupTestEnv(npmPlugin);

    const project1Root = resolve(gitRoot, 'projects', 'project1');
    await outputFile(resolve(project1Root, 'file1.txt'), 'content1');

    await commitAll(gitRoot, 'fix: file1');

    await applySemRel(gitRoot, 'project1', npmPlugin);

    // TODO : expect pushed
  }, 30000);
});
