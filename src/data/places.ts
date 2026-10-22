import type { ImageMetadata } from 'astro';
import streetArrival from '../assets/media/street-arrival.jpg';
import streetCentre from '../assets/media/street-centre.jpg';
import streetGate from '../assets/media/street-gate.jpg';
import streetLane from '../assets/media/street-lane.jpg';
import streetBack from '../assets/media/street-looking-back.jpg';
import courtyardKai from '../assets/media/courtyard-kai-cape.jpg';
import shopCorner from '../assets/media/shop-corner.jpg';
import shopWide from '../assets/media/shop-front-wide.jpg';
import pCourtyard from '../assets/media/painting-courtyard.jpg';
import pCourtyardConcept from '../assets/media/painting-courtyard-concept.jpg';
import pLane from '../assets/media/painting-seaside-lane.jpg';
import pHarbour from '../assets/media/painting-harbour.jpg';
import pChurch from '../assets/media/painting-church-square.jpg';
import pShop from '../assets/media/painting-shop.jpg';
import pHill from '../assets/media/painting-hill-village.jpg';
import pChapel from '../assets/media/painting-chapel.jpg';
import pCog from '../assets/media/painting-rusted-cog.jpg';
import pDyers from '../assets/media/painting-dyers-steps.jpg';
import pGarden from '../assets/media/painting-lumina-garden.jpg';

export type Place = {
  slug: string;
  name: string;
  status: 'built' | 'now' | 'next';
  statusText: string;
  image: ImageMetadata;
  imageAlt: string;
  frames?: { src: ImageMetadata; alt: string; caption: string }[];
  painting?: ImageMetadata;
  body: string;
};

export const places: Place[] = [
  {
    slug: 'courtyard',
    name: 'The courtyard',
    status: 'built',
    statusText: 'In the build. The first place, where every look test happens.',
    image: streetArrival,
    imageAlt: 'Kai walks into the courtyard with the five townsfolk standing around the well and the shop.',
    painting: pCourtyard,
    frames: [
      { src: courtyardKai, alt: 'Kai from behind, cape blowing, with the Shopkeeper and Child in the courtyard.', caption: 'Late afternoon in the courtyard. The painted sky replaces the atmosphere beyond two kilometres.' },
      { src: shopCorner, alt: 'Kai and the Shopkeeper at the shop corner under the blue awning.', caption: 'The shop corner, where the look was decided.' },
      { src: shopWide, alt: 'Wide view of the shop front and the arched gate.', caption: 'Shop front and the gate to the street.' },
    ],
    body: 'A square of pale paving with a well, a clock tower, a rose-plaster shop under a blue awning and a tree in a stone planter. The whole town starts here; the painting of it was the first asset, and the Unreal courtyard is built to match it.',
  },
  {
    slug: 'street',
    name: 'The street',
    status: 'built',
    statusText: 'In the build since 21 October. Built from the modular town kit.',
    image: streetCentre,
    imageAlt: 'A quiet street with a tree in a planter, an arched door with steps, and a lantern on a post.',
    frames: [
      { src: streetGate, alt: 'Looking through the arched gate from the plaza into the street.', caption: 'Through the gate from the plaza.' },
      { src: streetLane, alt: 'A lane opening into the street with a tree and shuttered windows.', caption: 'Lane into the street.' },
      { src: streetBack, alt: 'Looking back along the street toward the gate.', caption: 'Looking back toward the gate.' },
    ],
    body: 'The first place made from the kit: a set of seventeen wall, door, step and planter pieces that snap to a one-metre grid, so new places can be laid out as a small text file instead of modelled one at a time. The street proved the kit; the lane and harbour will use it next.',
  },
  {
    slug: 'seaside-lane',
    name: 'Seaside lane',
    status: 'now',
    statusText: 'Being laid out now. The way down from the courtyard to the water.',
    image: pLane,
    imageAlt: 'Painting of a lane descending between pale and ochre houses toward the sea.',
    body: 'A broad descending passage with pale and ochre house fronts, an arched door, doorsteps, and the bay visible at the end. It drops about three metres over its length and connects the courtyard to the harbour on one continuous map, no loading.',
  },
  {
    slug: 'harbour',
    name: 'The harbour',
    status: 'now',
    statusText: 'Being laid out now, with new kit pieces for the quay, water and a boat.',
    image: pHarbour,
    imageAlt: 'Painting of a harbour quay with a small boat and the bay beyond.',
    body: 'The quay at the bottom of the lane: a sea wall, bollards, a water plane and a small boat. It needs pieces the kit does not have yet, which is why it comes with the lane as one batch.',
  },
  {
    slug: 'church-square',
    name: 'Church square',
    status: 'next',
    statusText: 'Painted. Built in the earlier engine, to be rebuilt from the kit.',
    image: pChurch,
    imageAlt: 'Painting of an open lookout on a headland with a small chapel at right and a round teal tree.',
    body: 'An open lookout over the bay with a small chapel at the right and a round teal tree. The Old Man sits here. The way up is the harbour\'s arched door, and the climb happens in the fade between places.',
  },
  {
    slug: 'shop',
    name: 'Inside the shop',
    status: 'next',
    statusText: 'Painted. Built in the earlier engine, to be rebuilt.',
    image: pShop,
    imageAlt: 'Painting of a shop interior with shelves of pots and a lit doorway.',
    body: 'Through the lit door under the awning. Shelves of pots and a counter, the first interior.',
  },
  {
    slug: 'hill-village',
    name: 'Hill village',
    status: 'next',
    statusText: 'Painted. Built in the earlier engine, to be rebuilt.',
    image: pHill,
    imageAlt: 'Painting of a hilltop village with narrow houses and stairs.',
    body: 'Past the chapel, the houses climb the hill. The highest place in the town so far.',
  },
  {
    slug: 'chapel',
    name: 'The chapel',
    status: 'next',
    statusText: 'Painted. Built in the earlier engine, to be rebuilt.',
    image: pChapel,
    imageAlt: 'Painting of a small chapel interior with a dim doorway.',
    body: 'A small dim interior behind a real door, the first door in the game that opens and lets you step through.',
  },
  {
    slug: 'rusted-cog',
    name: 'The Rusted Cog',
    status: 'next',
    statusText: 'Concept painting. A tavern with a retired mill wheel over the hearth.',
    image: pCog,
    imageAlt: 'Concept painting of a tavern interior with a coral hearth and a round cog above it.',
    body: 'A cooper\'s store that kept its hearth and its habit of receiving anyone who needed to sit down. Greta keeps one table free until the evening boats are accounted for.',
  },
  {
    slug: 'dyers-steps',
    name: 'Dyers\' Steps',
    status: 'next',
    statusText: 'Concept painting. A court of borrowed colour.',
    image: pDyers,
    imageAlt: 'Concept painting of a stepped courtyard hung with dyed cloth.',
    body: 'A textile court on the old Market Row, where cloth hangs to dry in the colours the town wears.',
  },
  {
    slug: 'lumina-garden',
    name: 'Lumina\'s still garden',
    status: 'next',
    statusText: 'Concept painting. A private retreat.',
    image: pGarden,
    imageAlt: 'Concept painting of a walled garden with a still pool.',
    body: 'A walled garden belonging to the Lumina estate, the quiet place the story will need later.',
  },
];

export const courtyardConcept = pCourtyardConcept;
