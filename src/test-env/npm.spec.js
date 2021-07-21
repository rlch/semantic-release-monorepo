const { pathExists } = require('fs-extra');
const { resolve } = require('path');

const {
  setupNpmWorkspace,
  setupNpmProject,
  setupNpmTestEnv,
} = require('./npm');

describe('npm-test-env', () => {
  it('initializes a workspace', async () => {
    const gitRoot = await setupNpmWorkspace();
    expect(await pathExists(resolve(gitRoot, 'package.json'))).toBe(true);
    expect(await pathExists(resolve(gitRoot, '.releaserc.json'))).toBe(true);
  });

  it('adds a project to the workspace', async () => {
    const gitRoot = await setupNpmWorkspace();
    const projectName = 'test';
    await setupNpmProject(gitRoot, projectName);
    expect(
      await pathExists(
        resolve(gitRoot, 'projects', projectName, 'package.json')
      )
    ).toBe(true);
  }, 30000);

  it('creates a test environment', async () => {
    const projects = ['project1', 'project2'];
    const gitRoot = await setupNpmTestEnv(projects);
    expect(await pathExists(resolve(gitRoot, 'package.json'))).toBe(true);
    expect(await pathExists(resolve(gitRoot, '.releaserc.json'))).toBe(true);
    for (const project of projects) {
      expect(
        await pathExists(resolve(gitRoot, 'projects', project, 'package.json'))
      ).toBe(true);
    }
  }, 30000);
});
