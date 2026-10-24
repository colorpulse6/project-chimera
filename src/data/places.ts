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
import fLaneArrival from '../assets/media/lane-arrival.jpg';
import fLaneLookingBack from '../assets/media/lane-looking-back.jpg';
import fLaneKai from '../assets/media/lane-kai.jpg';
import fHarbourQuay from '../assets/media/harbour-quay.jpg';
import fHarbourBoat from '../assets/media/harbour-boat.jpg';
import fHarbourKai from '../assets/media/harbour-kai.jpg';
import fChurchArrival from '../assets/media/church-arrival.jpg';
import fChurchPainting from '../assets/media/church-painting.jpg';
import fChurchChapelDoor from '../assets/media/church-chapel-door.jpg';
import fChurchHeadland from '../assets/media/church-headland.jpg';
import fChurchKai from '../assets/media/church-kai.jpg';
import fVillageStairs from '../assets/media/village-stairs.jpg';
import fVillageAnna from '../assets/media/village-anna.jpg';
import fVillageDoorstep from '../assets/media/village-doorstep.jpg';
import fVillageKai from '../assets/media/village-kai.jpg';
import fSeaQuayPath from '../assets/media/sea-quay-path.jpg';
import fSeaBay from '../assets/media/sea-bay.jpg';
import fSeaNorthWall from '../assets/media/sea-north-wall.jpg';
import fSeaVillage from '../assets/media/sea-village.jpg';

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
    body: 'The first place made from the kit: a set of seventeen wall, door, step and planter pieces that snap to a one-metre grid, so new places can be laid out as a small text file instead of modelled one at a time. The street proved the kit. The lane, the harbour, the church square and the hill village were built the same way.',
  },
  {
    slug: 'seaside-lane',
    name: 'Seaside lane',
    status: 'built',
    statusText: 'In the build since 22 October. The way down from the courtyard to the water.',
    image: fLaneArrival,
    imageAlt: 'The lane from the courtyard end: pale and ochre house fronts, a blue awning, the sea at the bottom.',
    painting: pLane,
    frames: [
      { src: fLaneKai, alt: 'Kai walking down the lane toward the sea.', caption: 'Kai going down. The sea is always at the end of it.' },
      { src: fLaneLookingBack, alt: 'Looking back up the lane steps toward the courtyard clock tower.', caption: 'Looking back up the steps to the courtyard.' },
    ],
    body: 'A broad descending passage with pale and ochre house fronts, an arched door, doorsteps, and the bay at the end. It drops about three metres and joins the courtyard to the harbour on one continuous map, no loading. Innkeeper Rowan stands at the arched door, Frida on a doorstep with her plums, Grandmother Edith on a step.',
  },
  {
    slug: 'harbour',
    name: 'The harbour',
    status: 'built',
    statusText: 'In the build since 22 October, with quay, water and boat pieces added to the kit.',
    image: fHarbourQuay,
    imageAlt: 'The harbour quay with bollards and a lantern, the lavender headland across the bay.',
    painting: pHarbour,
    frames: [
      { src: fHarbourBoat, alt: 'A small dark boat moored against the quay by a brass bollard.', caption: 'The boat. It does not go anywhere yet.' },
      { src: fHarbourKai, alt: 'Kai on the quay beside the harbour house, the bay behind.', caption: 'Kai on the quay.' },
      { src: fSeaQuayPath, alt: 'The quay corner with Old Reed by the wall and the coast path climbing to the church terrace.', caption: 'From the quay the coast path climbs to the church square. Old Reed keeps the corner.' },
    ],
    body: 'The quay at the bottom of the lane: a sea wall, bollards, a lantern, a bench, a water plane and one small boat. Old Reed stands by the boat; Sal carries crates between the quay and the foot of the lane. A ramped coast path climbs from here to the church square.',
  },
  {
    slug: 'church-square',
    name: 'Church square',
    status: 'built',
    statusText: 'In the build since 22 October. Rebuilt from the kit with the sea walls added on 24 October.',
    image: fChurchPainting,
    imageAlt: 'The church square: a small white chapel with a bell gable and a navy arched door, a round tree, the headland across the bay.',
    painting: pChurch,
    frames: [
      { src: fChurchArrival, alt: 'Arriving on the church terrace from the coast path, the chapel ahead and Tom on the paving.', caption: 'Arriving from the coast path. Tom walks the terrace.' },
      { src: fChurchChapelDoor, alt: 'The chapel front with its bell, arched door and a pot of leaves.', caption: 'The chapel door. Closed, for now.' },
      { src: fChurchHeadland, alt: 'The lavender headland across the bay, seen over the curved parapet of the lookout.', caption: 'The lookout. Something stands on the headland. Tom has heard about lights.' },
      { src: fChurchKai, alt: 'Kai on the terrace, cape blowing, the headland and the sea beyond.', caption: 'Kai on the terrace.' },
    ],
    body: 'An open lookout over the bay with a small chapel, a round clipped tree, benches and a curved parapet. It is built from the painting, on a terrace above the sea, and reached on foot up the coast path from the harbour. Tom walks here, repeating what he has heard.',
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
    status: 'built',
    statusText: 'In the build since 22 October. The highest place in the town so far.',
    image: fVillageAnna,
    imageAlt: 'Anna standing by a stone fountain basin against the end parapet, the sea beyond.',
    painting: pHill,
    frames: [
      { src: fVillageStairs, alt: 'A long stair climbing between pale walls toward the village.', caption: 'The stair up from the church terrace.' },
      { src: fVillageDoorstep, alt: 'The Old Man with his cane at a dark doorway, a pot beside it.', caption: 'The Old Man has a doorstep now.' },
      { src: fVillageKai, alt: 'Kai walking toward the basin and Anna, the sea beyond the parapet.', caption: 'Kai in the village.' },
      { src: fSeaVillage, alt: 'The hill village from the sea: walls on a rocky shore, gable houses and a round tree above.', caption: 'From the sea, 24 October. The walls stand on rock now, not straight out of the water.' },
    ],
    body: 'Past the chapel, a stair climbs to a small square of gable houses on a causeway in the sea, with a fountain basin against the end parapet. Anna watches the flowers by the basin. The Old Man moved up here from the courtyard and has a doorstep.',
  },
  {
    slug: 'chapel',
    name: 'The chapel',
    status: 'now',
    statusText: 'Being built now, with the first door that opens.',
    image: pChapel,
    imageAlt: 'Painting of a small chapel interior with a dim doorway.',
    body: 'A small dim interior behind the chapel door on the church square, the first door in the game that opens. Kai uses it like a resident: walk up, face it, press E. A short fade to black, and he is inside.',
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
    status: 'now',
    statusText: 'Being built now, off the seaside lane. A court of borrowed colour.',
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
