// The public demo release. One entry per release; the download page shows the first.
// bytes and sha256 are of the stapled dmg as uploaded to the GitHub Release (shasum -a 256).
const repo = 'https://github.com/colorpulse6/project-chimera';

export type Demo = {
  version: string;
  tag: string;
  date: string;
  file: string;
  bytes: number;
  sha256: string;
  minMacOS: string;
  url: string;
  releaseUrl: string;
};

const release = (d: Omit<Demo, 'url' | 'releaseUrl'>): Demo => ({
  ...d,
  url: `${repo}/releases/download/${d.tag}/${d.file}`,
  releaseUrl: `${repo}/releases/tag/${d.tag}`,
});

export const demos: Demo[] = [
  release({
    version: '0.1.0',
    tag: 'demo-v0.1.0',
    date: '27 October 2026',
    file: 'ChimeraDemo-0.1.0-mac-arm64.dmg',
    bytes: 427953300,
    sha256: '1a911666306d784dbd0fe06f93555f51033e295228cb5b560a0d19bfbbdb21ed',
    minMacOS: '14',
  }),
];
