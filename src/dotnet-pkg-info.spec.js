const { getProjectRoot, getProjectName } = require('./dotnet-pkg-info');
const { directory } = require('tempy');
const { mkdir, outputFile } = require('fs-extra');
const { resolve } = require('path');

describe('dotnet-pkg-info', () => {
  describe('gets project root', () => {
    it('gets .csproj file path', async () => {
      const projectName = 'project1';
      const projectRoot = resolve(directory(), projectName);
      await outputFile(resolve(projectRoot, `${projectName}.csproj`), '');

      expect(await getProjectRoot(projectRoot)).toBe(projectRoot);
    });

    it('fails if no .csproj file', async () => {
      await expect(getProjectRoot(directory())).rejects.toThrow(
        'No .csproj file'
      );
    });
  });

  describe('gets project name', () => {
    it('gets .csproj name', async () => {
      const projectName = 'project1';
      const projectRoot = resolve(directory(), projectName);
      await outputFile(resolve(projectRoot, `${projectName}.csproj`), '');

      expect(await getProjectName(projectRoot)).toBe(projectName);
    });

    it('fails if no .csproj file', async () => {
      await expect(getProjectName(directory())).rejects.toThrow(
        'No .csproj file'
      );
    });
  });
});
