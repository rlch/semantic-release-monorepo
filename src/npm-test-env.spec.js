const execa = require('execa');
const { pathExists } = require('fs-extra');
const { resolve } = require('path');

const { setupWorkspace, setupProject } = require('./npm-test-env');

describe('npm-test-env', () => {
  it('initializes a workspace', async () => {
    const gitRoot = await setupWorkspace();
    expect(await pathExists(resolve(gitRoot, 'package.json'))).toBe(true);
    expect(await pathExists(resolve(gitRoot, '.releaserc.json'))).toBe(true);
  });

  it('adds a project to the workspace', async () => {
    const gitRoot = await setupWorkspace();
    const projectName = 'test';
    await setupProject(gitRoot, projectName);
    expect(
      await pathExists(
        resolve(gitRoot, 'projects', projectName, 'package.json')
      )
    ).toBe(true);
  }, 30000);

  it('creates a test environment', async () => {
    // TODO
  }, 30000);
});
