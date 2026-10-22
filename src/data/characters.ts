import type { ImageMetadata } from 'astro';
import kaiDrawing from '../assets/media/kai-drawing.jpg';
import kaiHero from '../assets/media/kai-hero.jpg';
import wwDrawing from '../assets/media/well-woman-drawing.jpg';
import wwFull from '../assets/media/well-woman-full.jpg';
import wwFace from '../assets/media/well-woman-face.jpg';
import skDrawing from '../assets/media/shopkeeper-drawing.jpg';
import skFull from '../assets/media/shopkeeper-full.jpg';
import skFace from '../assets/media/shopkeeper-face.jpg';
import omDrawing from '../assets/media/old-man-drawing.jpg';
import omFull from '../assets/media/old-man-full.jpg';
import omFace from '../assets/media/old-man-face.jpg';
import chDrawing from '../assets/media/child-drawing.jpg';
import chFull from '../assets/media/child-full.jpg';
import chFace from '../assets/media/child-face.jpg';
import fiDrawing from '../assets/media/fisherman-drawing.jpg';
import fiFull from '../assets/media/fisherman-full.jpg';
import fiFace from '../assets/media/fisherman-face.jpg';

export type Character = {
  slug: string;
  name: string;
  role: string;
  place: string;
  status: 'built' | 'now' | 'next';
  statusText: string;
  drawing: ImageMetadata;
  inGame: ImageMetadata;
  face?: ImageMetadata;
  extra?: { src: ImageMetadata; caption: string };
  body: string[];
};

export const kai: Character = {
  slug: 'kai',
  name: 'Kai',
  role: 'The hero',
  place: 'Everywhere the player goes',
  status: 'built',
  statusText: 'In the build since the first Unreal day',
  drawing: kaiDrawing,
  inGame: kaiHero,
  body: [
    'Kai is drawn, not modelled. His body came out of a single illustration through image-to-3D, then the drawing itself was projected back onto the mesh so the ink and colour are the artist\'s, not a texture painter\'s. He is a dark silhouette with a long navy cape, a ring collar, one pale bare arm, heavy pointed boots and a crown of red hair. Red is his mark; nobody else in the town wears it.',
    'He walks and runs with planted feet and a real stride with flight, solved from his own leg geometry. At rest he is whole. The brief says the drawing of him sometimes fails; that part is designed but not yet in the game.',
  ],
};

export const townsfolk: Character[] = [
  {
    slug: 'well-woman',
    name: 'Well Woman',
    role: 'Draws water in the courtyard',
    place: 'Courtyard, by the well',
    status: 'built',
    statusText: 'First figure through the drawing-to-game route, 21 October',
    drawing: wwDrawing, inGame: wwFull, face: wwFace,
    body: [
      'A tall woman in a teal dress with a swept bun and a round void in her hem. She was the test case for the townsfolk pipeline: generated body, built oval mask head with two eyes, built hands clasped in front. Her face was the hardest part; generated heads came out lumpy, so the head is modelled by hand and only the body carries the drawing.',
    ],
  },
  {
    slug: 'shopkeeper',
    name: 'Shopkeeper',
    role: 'Keeps the shop under the blue awning',
    place: 'Courtyard, shop door',
    status: 'built',
    statusText: 'Rebuilt from the drawing on 22 October',
    drawing: skDrawing, inGame: skFull, face: skFace,
    body: [
      'A yellow robe with a wide straw cone hat and a void in the chest. He was the first resident in the Unreal build and the one every look test was run on. The current version replaced the earlier procedural figure, which never shook the feeling of parts stacked together.',
    ],
  },
  {
    slug: 'old-man',
    name: 'Old Man',
    role: 'Sits with a cane on the church hill',
    place: 'Church square',
    status: 'built',
    statusText: 'Rebuilt from the drawing on 22 October',
    drawing: omDrawing, inGame: omFull, face: omFace,
    body: [
      'A violet robe, a stoop, and a ring where the head should be. The ring is built as a torus so it reads clean from every angle; the cane stayed from the earlier version. He is the figure that shows what the masks-and-holes language can do with the least material.',
    ],
  },
  {
    slug: 'child',
    name: 'Child',
    role: 'Runs the courtyard',
    place: 'Courtyard',
    status: 'built',
    statusText: 'Rebuilt from the drawing on 22 October; one of the two walkers',
    drawing: chDrawing, inGame: chFull, face: chFace,
    body: [
      'A coral smock with a void at the chest and a brown bob. She is one of the two residents who walk a route instead of standing at a post, so the courtyard is never still. The bob reads as a cap at the moment; that is on the polish list.',
    ],
  },
  {
    slug: 'fisherman',
    name: 'Fisherman',
    role: 'Walks between the quay and the square',
    place: 'Street and harbour',
    status: 'built',
    statusText: 'Rebuilt from the drawing on 22 October; one of the two walkers',
    drawing: fiDrawing, inGame: fiFull, face: fiFace,
    body: [
      'Blue tunic, wide trousers, a steep blue cone hat and a void at the shoulder. He walks. His hat is steeper than the drawing wants and will be flattened in the next polish pass.',
    ],
  },
];
