const { outputFile } = require('fs-extra');
const { resolve, relative, normalize } = require('path');

const { getRoot, getRelativePath, getCommitFiles } = require('./git-utils');
const { commitAll, setupGitTestEnv } = require('../test-env');

describe('git-utils', () => {
  it('gets commit files', async () => {
    const gitRoot = await setupGitTestEnv();

    const filePath = resolve(gitRoot, 'projects', 'project1', 'file1.txt');
    await outputFile(filePath, 'content1');

    const hash = await commitAll(gitRoot, 'fix: file1');

    const commitFiles = (await getCommitFiles(hash, gitRoot)).map(x =>
      normalize(x)
    );
    expect(commitFiles).toIncludeAllMembers([relative(gitRoot, filePath)]);
  });

  it('gets git root from root', async () => {
    const gitRoot = await setupGitTestEnv();

    const root = normalize(await getRoot(gitRoot));
    expect(root).toBe(gitRoot);
  });

  it('gets git root from subdirectory', async () => {
    const gitRoot = await setupGitTestEnv(['project1']);
    const project1Root = resolve(gitRoot, 'projects', 'project1');

    const root = normalize(await getRoot(project1Root));
    expect(root).toBe(gitRoot);
  });

  it('gets relative path', async () => {
    const gitRoot = await setupGitTestEnv(['project1']);
    const project1Root = resolve(gitRoot, 'projects', 'project1');

    const relativePath = await getRelativePath(project1Root, project1Root);
    expect(relativePath).toBe(relative(gitRoot, project1Root));
  });
});
