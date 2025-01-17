const { mapNextReleaseVersion, mapCommits } = require('./options-transforms');

const OPTIONS = {
  commits: [1, 2, 3, 4],
  lastRelease: {
    version: '1.2.3',
  },
  nextRelease: {
    version: '4.5.6',
  },
};

const even = n => n % 2 === 0;
const toTag = x => `app-${x}`;

describe('semantic-release plugin options transforms', () => {
  describe('#mapCommits', () => {
    it('allows mapping the "commits" option', async () => {
      const fn = commits => commits.filter(even);

      await expect(mapCommits(fn)(OPTIONS)).resolves.toEqual({
        ...OPTIONS,
        commits: [2, 4],
      });
    });
  });

  describe('#mapNextReleaseVersion', () => {
    it('maps the nextRelease.version option', async () => {
      await expect(mapNextReleaseVersion(toTag)(OPTIONS)).resolves.toEqual({
        ...OPTIONS,
        nextRelease: {
          version: 'app-4.5.6',
        },
      });
    });
  });
});
