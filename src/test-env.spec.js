const execa = require('execa');
const { pathExists } = require('fs-extra');
const { resolve } = require('path');

const {
  clone,
  createOrigin,
  setupWorkspace,
  setupProject,
} = require('./test-env');

describe('test-env', () => {
  it('creates an origin git repository', async () => {
    const originDirectory = await createOrigin();
    expect(await pathExists(originDirectory)).toBe(true);
    expect(
      (
        await execa('git', [
          'ls-remote',
          '--heads',
          `file://${originDirectory}`,
        ])
      ).stdout
    ).toBe('');
  });

  it('clones a git repository', async () => {
    const originDirectory = await createOrigin();
    const gitRepoUrl = `file://${originDirectory}`;
    const gitRoot = await clone(gitRepoUrl);
    expect(await pathExists(gitRoot)).toBe(true);
  });
});
