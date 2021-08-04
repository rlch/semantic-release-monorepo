const execa = require('execa');
const { outputJson, readFile, writeFile, outputFile } = require('fs-extra');
const { resolve } = require('path');

const { createOrigin, clone, pushAll } = require('./common');

const setupDotnetSolution = async () => {
  const originDirectory = await createOrigin();
  const gitRepoUrl = `file://${originDirectory}`;
  const gitRoot = await clone(gitRepoUrl);

  await execa('dotnet', ['new', 'sln', '-n', 'TestSolution'], { cwd: gitRoot });
  await outputJson(resolve(gitRoot, '.releaserc.json'), {
    plugins: [
      '@semantic-release/commit-analyzer',
      '@semantic-release/release-notes-generator',
    ],
  });
  await pushAll(gitRoot, 'chore: init solution');

  return gitRoot;
};

const setupDotnetProject = async (gitRoot, projectName) => {
  await execa('dotnet', ['new', 'console', '-o', projectName], {
    cwd: gitRoot,
  });
  await execa(
    'dotnet',
    ['sln', 'add', `${projectName}\\${projectName}.csproj`],
    { cwd: gitRoot }
  );
  await outputFile(
    resolve(gitRoot, projectName, `${projectName}.csproj`),
    `<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
      <TargetFrameworks>net5.0;netcoreapp3.1</TargetFrameworks>
      <LangVersion>9</LangVersion>
  </PropertyGroup>
  <PropertyGroup>
      <Version>1.0.0</Version>
  </PropertyGroup>
</Project>`
  );
  await pushAll(gitRoot, `chore: init ${projectName}'`);
};

const setupDotnetTestEnv = async (projectNames = []) => {
  const gitRoot = await setupDotnetSolution();

  for (const projectName of projectNames) {
    await setupDotnetProject(gitRoot, projectName);
  }

  return gitRoot;
};

const getDotNetProjectRoot = (gitRoot, projectName) => {
  return resolve(gitRoot, projectName);
};

module.exports = {
  setupDotnetSolution,
  setupDotnetProject,
  setupDotnetTestEnv,
  getDotNetProjectRoot,
};
