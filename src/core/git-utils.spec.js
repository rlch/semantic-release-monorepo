const { directory } = require('tempy');
const { resolve } = require('path');
const execa = require('execa');
const { mkdir } = require('fs-extra');
const { getRoot, getRelativePath } = require('./git-utils');

describe('git-utils', () => {
  const cwd = process.cwd();

  it('gets git root from root', async () => {
    const gitOrigin = directory();
    process.chdir(gitOrigin);
    const gitRepoName = 'workspace';
    await execa('git', ['init', '--bare', `${gitRepoName}.git`]);
    const gitRepoDirectory = resolve(gitOrigin, `${gitRepoName}.git`);
    const gitRepo = `file://${gitRepoDirectory}`;

    const srcRoot = directory();
    process.chdir(srcRoot);
    await execa('git', ['clone', gitRepo]);
    const gitRoot = resolve(srcRoot, gitRepoName);

    process.chdir(gitRoot);

    const root = await getRoot();
    expect(resolve(root)).toBe(gitRoot);
  });

  it('gets git root from subdirectory', async () => {
    const gitOrigin = directory();
    process.chdir(gitOrigin);
    const gitRepoName = 'workspace';
    await execa('git', ['init', '--bare', `${gitRepoName}.git`]);
    const gitRepoDirectory = resolve(gitOrigin, `${gitRepoName}.git`);
    const gitRepo = `file://${gitRepoDirectory}`;

    const srcRoot = directory();
    process.chdir(srcRoot);
    await execa('git', ['clone', gitRepo]);
    const gitRoot = resolve(srcRoot, gitRepoName);

    const project1Name = 'test1';
    const project1Root = resolve(gitRoot, 'projects', project1Name);
    await mkdir(project1Root, { recursive: true });

    process.chdir(project1Root);

    const root = await getRoot();
    expect(resolve(root)).toBe(gitRoot);
  });

  it('gets relative path', async () => {
    const gitOrigin = directory();
    process.chdir(gitOrigin);
    const gitRepoName = 'workspace';
    await execa('git', ['init', '--bare', `${gitRepoName}.git`]);
    const gitRepoDirectory = resolve(gitOrigin, `${gitRepoName}.git`);
    const gitRepo = `file://${gitRepoDirectory}`;

    const srcRoot = directory();
    process.chdir(srcRoot);
    await execa('git', ['clone', gitRepo]);
    const gitRoot = resolve(srcRoot, gitRepoName);

    const project1Name = 'test1';
    const project1Root = resolve(gitRoot, 'projects', project1Name);
    await mkdir(project1Root, { recursive: true });

    process.chdir(project1Root);

    const relativePath = await getRelativePath(project1Root);
    expect(resolve(gitRoot, relativePath)).toBe(project1Root);
  });
});
