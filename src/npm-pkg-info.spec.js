const { getProjectRoot, getProjectName } = require('./npm-pkg-info');
const { directory } = require('tempy');
const { mkdir, outputJson } = require('fs-extra');
const { resolve } = require('path');

describe('npm-pkg-info', () => {
  describe('gets project root', () => {
    it('gets package.json file path', async () => {
      const gitRoot = directory();
      await outputJson(resolve(gitRoot, 'package.json'), {
        name: 'workspace',
        version: '0.0.0',
      });
      const projectName = 'test';
      const projectRoot = resolve(gitRoot, 'projects', projectName);
      await outputJson(resolve(projectRoot, 'package.json'), {
        name: projectName,
        version: '0.0.0',
      });

      const cwd = process.cwd();
      process.chdir(projectRoot);

      await expect(getProjectRoot()).resolves.toBe(projectRoot);

      process.chdir(cwd);
    });

    it('fails if no package.json file', async () => {
      const gitRoot = directory();
      await outputJson(resolve(gitRoot, 'package.json'), {
        name: 'workspace',
        version: '0.0.0',
      });
      const projectName = 'test';
      const projectRoot = resolve(gitRoot, 'projects', projectName);
      await mkdir(projectRoot, { recursive: true });

      const cwd = process.cwd();
      process.chdir(projectRoot);

      await expect(getProjectRoot()).rejects.toThrow('No package.json file');

      process.chdir(cwd);
    });
  });

  describe('gets project name', () => {
    it('gets package.json name', async () => {
      const gitRoot = directory();
      const projectName = 'test';
      const projectRoot = resolve(gitRoot, 'projects', projectName);
      await outputJson(resolve(projectRoot, 'package.json'), {
        name: projectName,
        version: '0.0.0',
      });

      const cwd = process.cwd();
      process.chdir(projectRoot);

      await expect(getProjectName()).resolves.toBe(projectName);

      process.chdir(cwd);
    });

    it('fails if no package.json file', async () => {
      const gitRoot = directory();
      await outputJson(resolve(gitRoot, 'package.json'), {
        name: 'workspace',
        version: '0.0.0',
      });
      const projectName = 'test';
      const projectRoot = resolve(gitRoot, 'projects', projectName);
      await mkdir(projectRoot, { recursive: true });

      const cwd = process.cwd();
      process.chdir(projectRoot);

      await expect(getProjectName()).rejects.toThrow('No package.json file');

      process.chdir(cwd);
    });
  });
});
