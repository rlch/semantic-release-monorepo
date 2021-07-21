const { resolve } = require('path');
const { directory } = require('tempy');

const {
  getProjectRoot,
  getProjectName,
  getProjectNameSync,
} = require('./npm-pkg-info');
const { setupNpmTestEnv } = require('./test-env/npm');

describe('npm-pkg-info', () => {
  describe('gets project root', () => {
    it('gets package.json file path', async () => {
      const projectName = 'my-project';
      const gitRoot = await setupNpmTestEnv([projectName]);
      const projectRoot = resolve(gitRoot, 'projects', projectName);

      await expect(getProjectRoot(projectRoot)).resolves.toBe(projectRoot);
    });

    it('fails if no package.json file', async () => {
      await expect(getProjectRoot(directory())).rejects.toThrow(
        'No package.json file'
      );
    });
  });

  describe('gets project name', () => {
    it('gets package.json name', async () => {
      const projectName = 'my-project';
      const gitRoot = await setupNpmTestEnv([projectName]);
      const projectRoot = resolve(gitRoot, 'projects', projectName);

      await expect(getProjectName(projectRoot)).resolves.toBe(projectName);
    });

    it('fails if no package.json file', async () => {
      await expect(getProjectName(directory())).rejects.toThrow(
        'No package.json file'
      );
    });
  });

  describe('gets project name synchronously', () => {
    it('gets package.json name', async () => {
      const projectName = 'my-project';
      const gitRoot = await setupNpmTestEnv([projectName]);
      const projectRoot = resolve(gitRoot, 'projects', projectName);

      expect(getProjectNameSync(projectRoot)).toBe(projectName);
    });

    it('fails if no package.json file', async () => {
      expect(() => getProjectNameSync(directory())).toThrow(
        'No package.json file'
      );
    });
  });
});
