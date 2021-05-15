const { getProjectRoot, getProjectName } = require('./dotnet-pkg-info');

describe('dotnet', () => {
  it('gets .csproj file path', async () => {
    expect(await getProjectRoot()).toBe(process.cwd());
  });

  it('gets .csproj name', async () => {
    expect(await getProjectName()).toBe('test');
  });
});
