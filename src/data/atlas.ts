/* The chart. There is no approved painted map of this world. There is the build:
   fresh-game/assets/world/vista.json (v2.3, 27 October 2026) places every region
   and far silhouette in metres from the Havenwood square, and marks every pin
   provisional. The walkable prototypes have their own origins. This file is a
   transcription of those numbers, with what the painting shows and what the
   record knows about each one. x runs east (toward the Long Road and the
   Colossus), y runs north. */
import type { ImageMetadata } from 'astro';
import { places } from './places';
import pHavenwood from '../assets/media/painting-havenwood-v3.jpg';
import pLongRoad from '../assets/media/painting-long-road-v3.jpg';
import pHighPass from '../assets/media/painting-high-pass-v3.jpg';
import pShadow from '../assets/media/painting-shadow-country-v3.jpg';
import pSaltRoad from '../assets/media/painting-salt-road-v3.jpg';
import pArchive from '../assets/media/painting-archive-forest-v3.jpg';
import pHangingSea from '../assets/media/painting-hanging-sea-v3.jpg';
import pColossus from '../assets/media/painting-weeping-colossus-v3.jpg';
import kesler from '../assets/media/salt-road-cp1-kesler-pi.jpg';

const place = (slug: string) => {
  const p = places.find((x) => x.slug === slug);
  if (!p) throw new Error(`atlas: no place ${slug}`);
  return p;
};

export type Pin = {
  id: string;
  name: string;
  /** metres from the square: x east, y north */
  pos: [number, number];
  kind: 'region' | 'landmark' | 'far';
  state: 'built' | 'now' | 'next';
  stateText: string;
  image?: ImageMetadata;
  alt?: string;
  /** what the painting shows, or what stands there */
  painted: string;
  /** what the build knows */
  record: string;
  /** radius in metres of its own ground, if it has any */
  hole?: number;
  /** where the label sits */
  label: 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';
  /** a page anchor with the full record */
  href?: string;
};

export const pins: Pin[] = [
  {
    id: 'havenwood', name: 'Havenwood', pos: [0, 0], kind: 'region', state: 'built', stateText: 'In the public demo',
    image: pHavenwood, alt: 'Painting of Havenwood: a square with a well, coloured houses and a bell tower.',
    painted: 'A square with a well and four flower beds, plaster houses in coral, lavender and ochre, a bell tower, and the walls of the Lumina estate on the hill above.',
    record: 'The origin. The town’s own ground and sea reach 3.2 km from the square; past the first kilometre the town’s own ground is sea, and the Long Road has its own. Twelve places on one map with no loading. The whole far layer is placed from here.',
    hole: 3200, label: 'nw', href: '#havenwood',
  },
  {
    id: 'cove', name: 'Keepers’ Cove', pos: [452, -285], kind: 'region', state: 'now', stateText: 'Internal build',
    image: place('cove-settlement').image, alt: place('cove-settlement').imageAlt,
    painted: 'A small settlement below the ridge: a jetty, terraced houses, a hall and a household with a loom. In the concept it has been preparing for Kai for generations, with clothes cut to his measure. In the build, five stand-ins with stand-in lines.',
    record: 'Half a kilometre south-east of the square, inside the town’s own ground. Named by Nic on 30 October. Paths, a lantern pool and two interiors packaged; not in Demo 0.1.0.',
    label: 'e', href: '#cove-settlement',
  },
  {
    id: 'long-road', name: 'The Long Road', pos: [450, -860], kind: 'region', state: 'built', stateText: 'In the public demo',
    image: pLongRoad, alt: 'Painting of the Long Road: a dirt road through golden hills down to a river and the bay.',
    painted: 'A dirt road through golden hills, down to a river, a stone bridge and a village by the water, and out to the bay. On the ridge, the broken arches of the Arc and a ring of stone.',
    record: 'Its origin is 1 km south-east of the quay, since the L1 move of 27 October; its own ground reaches 5.6 km. Joined to the harbour by the coast road with no loading break. Walkable in Demo 0.1.0.',
    hole: 5600, label: 's', href: '#long-road',
  },
  {
    id: 'desert', name: 'The opening desert', pos: [-7000, -2500], kind: 'region', state: 'now', stateText: 'Internal build',
    image: place('opening-desert').image, alt: place('opening-desert').imageAlt,
    painted: 'Sand, rocks, and a long flat shape on the ridge. Kai walks until he falls.',
    record: '7.4 km west-south-west, with 3 km of its own ground. Crest dust, camera tremors and a Reduce motion option are packaged. No pulse, no voice, nothing rising yet. It is also a late chapter.',
    hole: 3000, label: 'w', href: '#opening-desert',
  },
  {
    id: 'salt-road', name: 'The Salt Road, walkable', pos: [-6500, -10000], kind: 'region', state: 'now', stateText: 'Internal build, checkpoint 2',
    image: place('salt-road-trail').image, alt: place('salt-road-trail').imageAlt,
    painted: 'A desert trail past buried hull fragments to the outer wall of Kesler Pi. The threshold is blocked. There is no interior.',
    record: '11.9 km south-west. The checkpoint stands apart from its own painted silhouette, which is 23 km out to the east-south-east: the Salt Road is in two places until Nic walks it and the marker is moved. No walking link from the desert.',
    label: 's', href: '#salt-road-trail',
  },
  {
    id: 'high-pass', name: 'The High Pass', pos: [-12500, 1500], kind: 'region', state: 'now', stateText: 'Private terrace slice accepted, 7 November',
    image: pHighPass, alt: 'Painting of the High Pass: a refuge on a cliff path above a blue lake and a stone arch in the snow.',
    painted: 'A plaster refuge with a terracotta roof on a cliff path, a dead tree beside it, a blue glacial lake below. Across the water a great stone arch in the snow, with a warm light inside.',
    record: 'The terrace stands 12.6 km west at 1,500 m, on its own shelf; the lake, the gateway massif and the snow crest of the Spine are placed around it. HP-1b, accepted 7 November: twenty-nine walk targets, both refuge transitions and supported edge pushes passed, closing HP-1’s three findings. Wider side approaches, finished art and performance remain open.',
    hole: 482, label: 'n', href: '#high-pass-refuge',
  },
  {
    id: 'ferrus-magna', name: 'Ferrus Magna', pos: [-14750, -1200], kind: 'landmark', state: 'next', stateText: 'Named, no card yet',
    painted: 'Three towers on a ridge-hill, right of the arch from the terrace, at eye level.',
    record: 'The industrial continent of the 2025 writing, reduced for now to three towers about 3.5 km from the terrace pin, at its eye level. Seen only from the High Pass.',
    label: 'sw',
  },
  {
    id: 'lone-peak', name: 'The lone peak', pos: [9100, -6000], kind: 'landmark', state: 'next', stateText: 'A far silhouette',
    painted: 'The tall peak to the right of the town’s eastern view, and central from the Long Road arrival.',
    record: '10.9 km east-south-east, 1,400 m high. Every painted sightline passes it. From the square the Colossus is the faint tall shape behind it and to its right.',
    label: 'n',
  },
  {
    id: 'archive-forest', name: 'The Great Archive Forest', pos: [11600, -11200], kind: 'far', state: 'next', stateText: 'Painted, a silhouette on the horizon',
    image: pArchive, alt: 'Painting of the Archive Forest: giant amber trunks with turquoise veins over a stone house.',
    painted: 'Trunks as wide as towers, amber and quartz with turquoise veins, and the shapes of people inside them. A stone house and a small waterfall at their feet.',
    record: 'A band of ten giant amber trees, 16 km out, raised 400 m to clear the eastern hills. From the Long Road it is the grove left of the peak.',
    label: 'w',
  },
  {
    id: 'salt-flats', name: 'The Salt Road, painted', pos: [15600, -16200], kind: 'far', state: 'next', stateText: 'Painted, a silhouette on the horizon',
    image: pSaltRoad, alt: 'Painting of the Salt Road: steps above a salt basin, white ribs in the sand and a far city.',
    painted: 'Sandstone steps by a house with a blue cloth in the door, a salt basin between dunes, great white ribs half buried, a caravan, an oasis town in palms, and a city on the far horizon.',
    record: 'A pale disc of salt 9 km wide, 22.5 km out, seen from the High Pass look-back. Provisional: the walkable checkpoint is on the other side of the chart.',
    label: 'sw',
  },
  {
    id: 'kesler-pi', name: 'Kesler Pi', pos: [18000, -19000], kind: 'far', state: 'now', stateText: 'Exterior built, interior unwritten',
    image: kesler, alt: 'The dark mass of Kesler Pi on the salt horizon, from the first Salt Road checkpoint.',
    painted: 'A dark, patched mass buried in sand, with no visible wheels, treads, legs or wake. In the painting, the city at the west end of the Salt Road; before 5 November, the desert pirate dreadnought.',
    record: 'The silhouette stands 26 km south-east on the salt. The built hull wall and blocked threshold are at the walkable checkpoint. Zephyr, the smaller moving refuge, is kept but out of scope.',
    label: 'e', href: '#salt-road-trail',
  },
  {
    id: 'shadow-country', name: 'The Shadow Country', pos: [22100, -10800], kind: 'far', state: 'next', stateText: 'Painted, a silhouette on the horizon',
    image: pShadow, alt: 'Painting of the Shadow Country: sunlit channels, willows and an aqueduct with waterfalls.',
    painted: 'Braided channels under willows, a ferry, sluice gates and an aqueduct that spills into waterfalls. High in the clouds a vast shape lets a turquoise fall drop. The name is darker than the painting, and the painting wins.',
    record: 'An arcade and its falls on a shelf hill 24.6 km out, 4 degrees off the bearing to the Colossus. From the Long Road the road’s own hills hide it for now.',
    label: 'ne',
  },
  {
    id: 'hanging-sea', name: 'The Hanging Sea', pos: [9500, 9500], kind: 'far', state: 'next', stateText: 'Painted, a silhouette on the horizon',
    image: pHangingSea, alt: 'Painting of the Hanging Sea: a sea overhead with ships and sharks, above a canyon harbour.',
    painted: 'A sea held overhead, ships and fish drifting in it, above a harbour in a canyon.',
    record: 'A flat lens of water 650 m up over a canyon 13.4 km north-east, with one falling column. Behind the town’s eastern view; seen from the harbour side.',
    label: 'n',
  },
  {
    id: 'colossus', name: 'The Weeping Colossus', pos: [46000, -18600], kind: 'far', state: 'next', stateText: 'Painted, the horizon anchor',
    image: pColossus, alt: 'Painting of the Weeping Colossus: travellers on a hillside path, and in the clouds a vast tilted shape with water pouring from it.',
    painted: 'Travellers on a hillside path past a villa, lakes and valleys below, and in the clouds a vast tilted shape with water pouring from it.',
    record: '49.6 km east-south-east, feet on a range at 1,600 m, 9 km tall; the head dissolves in the cloud deck at 7 km. Seen from the town, the road and the pass. Everything on this chart faces it.',
    label: 'se',
  },
];

/** Far ranges, crest lines in metres. Drawn faint; they are what the horizon is made of. */
export const ranges: { id: string; pts: [number, number][]; h: number }[] = [
  { id: 'the Spine of the Ancients', pts: [[-17500, 5000], [-18500, 1000], [-18000, -3000], [-16500, -6500]], h: 2600 },
  { id: 'the Colossus range', pts: [[41000, -30000], [44000, -23500], [46000, -18600], [48000, -13000], [50000, -7000]], h: 2500 },
  { id: 'the eastern hills', pts: [[10500, -8500], [12000, -6000], [14000, 0]], h: 550 },
  { id: 'the salt rim mesas', pts: [[22000, -24000], [26000, -19000]], h: 1500 },
  { id: 'the canyon walls', pts: [[6000, 12000], [10000, 10000], [13000, 7000]], h: 700 },
  { id: 'the archive foothills', pts: [[9000, -15000], [12000, -12500], [15000, -9500]], h: 650 },
];

/** What each painted view must be able to see (vista.json sightlines_required). */
export const sightlines: [string, string][] = [
  ['havenwood', 'colossus'], ['havenwood', 'lone-peak'],
  ['long-road', 'colossus'], ['long-road', 'lone-peak'], ['long-road', 'shadow-country'], ['long-road', 'archive-forest'],
  ['high-pass', 'ferrus-magna'], ['high-pass', 'colossus'], ['high-pass', 'lone-peak'], ['high-pass', 'kesler-pi'],
];

/** Salt Road: the walkable checkpoint and its painted silhouette are the same place, provisionally apart. */
export const doubles: [string, string][] = [['salt-road', 'salt-flats']];

export const km = (p: [number, number]) => Math.hypot(p[0], p[1]) / 1000;
