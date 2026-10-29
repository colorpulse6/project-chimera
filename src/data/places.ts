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
import fChapelRoom from '../assets/media/chapel-room.jpg';
import fChapelBenches from '../assets/media/chapel-benches.jpg';
import fChapelKai from '../assets/media/chapel-kai.jpg';
import fDoorPrompt from '../assets/media/chapel-door-prompt.jpg';
import fDyersCourt from '../assets/media/dyers-court.jpg';
import fDyersVats from '../assets/media/dyers-vats.jpg';
import fDyersTerrace from '../assets/media/dyers-from-terrace.jpg';
import fDyersKai from '../assets/media/dyers-kai.jpg';
import fShopRoom from '../assets/media/shop-room.jpg';
import fShopDoor from '../assets/media/shop-door.jpg';
import fShopKai from '../assets/media/shop-kai.jpg';
import fGardenFountain from '../assets/media/garden-fountain.jpg';
import fGardenView from '../assets/media/garden-view.jpg';
import fGardenLadder from '../assets/media/garden-ladder.jpg';
import fGardenRoseDoor from '../assets/media/garden-rose-door.jpg';
import fGardenKai from '../assets/media/garden-kai.jpg';
import fCogRoom from '../assets/media/cog-room.jpg';
import fCogHearth from '../assets/media/cog-hearth.jpg';
import fCogGreta from '../assets/media/cog-greta.jpg';
import fCogKai from '../assets/media/cog-kai.jpg';
import fEstateRoad from '../assets/media/estate-road.jpg';
import fEstateFoot from '../assets/media/estate-foot.jpg';
import fEstateViewBack from '../assets/media/estate-view-back.jpg';
import fEstateGateLine from '../assets/media/estate-gate-line.jpg';
import pEstate from '../assets/media/painting-estate-approach.jpg';
import fDesertArrival from '../assets/media/desert-arrival.jpg';
import fDesertKai from '../assets/media/desert-kai.jpg';
import fDesertRocks from '../assets/media/desert-rocks.jpg';

import fLongRoad from '../assets/media/longroad1-arrival.jpg';
import fLongRoadArrival from '../assets/media/longroad6-arrival.jpg';
import fB1LongRoad from '../assets/media/b1-longroad-arrival.jpg';
import fPar2Causeway from '../assets/media/par2-causeway.jpg';
import fPar2Settlement from '../assets/media/par2-settlement-jetty.jpg';
import fPar7Sea from '../assets/media/par7-harbour-sea.jpg';
import fPar7Road from '../assets/media/par7-longroad-trees.jpg';
import fPar7Settlement from '../assets/media/par7-settlement-shore.jpg';
import fPar9Hall from '../assets/media/par9-hall-inside.jpg';
import fPar9River from '../assets/media/par9-river-wind.jpg';
import fPar9Settlement from '../assets/media/par9-settlement-paths.jpg';
import fLongRoadRiver from '../assets/media/longroad6-river.jpg';
import fLongRoadHollow from '../assets/media/longroad6-hollow.jpg';
import fLongRoadRepair from '../assets/media/longroad6-repair.jpg';

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
      { src: fPar7Sea, alt: 'Kai on the harbour quay facing deep blue water, the causeway gate and lavender hills.', caption: 'Par7 internal package, 28 October. Nic later said this build looked good; a clean performance result remains open.' },
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
    status: 'built',
    statusText: 'In the build since 24 October. Passed at its second look.',
    image: fChapelKai,
    imageAlt: 'Kai from behind in the chapel aisle, benches either side, the arched window at the end.',
    painting: pChapel,
    frames: [
      { src: fDoorPrompt, alt: 'Kai at the chapel\'s navy door, a small prompt to enter at his feet.', caption: 'The first door that opens. Walk up, face it, press E.' },
      { src: fChapelRoom, alt: 'The chapel from the door: an aisle of warm light, benches, lavender floor, the window over the altar block.', caption: 'From the door, the way the painting sees it.' },
      { src: fChapelBenches, alt: 'Benches from the side, the sun patch on the floor, the altar block under the window.', caption: 'The sun comes in through the one window.' },
    ],
    body: 'A small dim room behind the chapel door on the church square, with benches, an altar block and one tall window facing the late sun. It was the first door in the game that opens: a short fade to black and Kai is inside. Its walls first came out cream; the polish round warmed them toward the painting. Father Silas stands in here now.',
  },
  {
    slug: 'rusted-cog',
    name: 'The Rusted Cog',
    status: 'built',
    statusText: 'In the build since 24 October. Nic: fine for now.',
    image: fCogRoom,
    imageAlt: 'The tavern: a coral hearth with a cog wheel above it, teal beams, a bar with stools, an arch to the sunlit yard.',
    painting: pCog,
    frames: [
      { src: fCogGreta, alt: 'Greta behind the bar with a bowl, a niche of bottles and jars behind her.', caption: 'Greta behind the bar.' },
      { src: fCogHearth, alt: 'The hearth with a pot hanging in it and the retired mill wheel above.', caption: 'The mill wheel retired over the hearth.' },
      { src: fCogKai, alt: 'Kai from behind inside the tavern, tables and the bar ahead.', caption: 'Kai inside. Old Ferris and the Hooded Stranger are here too.' },
    ],
    body: 'A cooper\'s store that kept its hearth and its habit of receiving anyone who needed to sit down. The third interior: a coral hearth with the old mill wheel above it, dark teal beams, a bar with stools and a barrel, a niche of vessels, side tables. Greta keeps it. Old Ferris and the Hooded Stranger sit in it.',
  },
  {
    slug: 'dyers-steps',
    name: 'Dyers\' Steps',
    status: 'built',
    statusText: 'In the build since 24 October. Passed at its second look.',
    image: fDyersCourt,
    imageAlt: 'The stepped court in sun: a drying frame with indigo and coral cloths, a clay vat, a clipped tree, an arch.',
    painting: pDyers,
    frames: [
      { src: fDyersKai, alt: 'Kai from behind in the court, cloths hanging on the left.', caption: 'Kai in the court.' },
      { src: fDyersVats, alt: 'Two dye vats, terracotta and ochre, under hanging indigo, coral and cream cloths and a loom.', caption: 'The vats, the cloths and the loom.' },
      { src: fDyersTerrace, alt: 'The court\'s buildings from the church terrace across the water, a stair down to the quay.', caption: 'From the church terrace across the water.' },
    ],
    body: 'A textile court off the seaside lane, on the old Market Row, where cloth hangs to dry in the colours the town wears. Steps, a drying frame, dye vats, a loom, pots and plants. The second look added the plants, more cloth and a deeper indigo. The arch still looks onto rocks and a wall instead of down to the town.',
  },
  {
    slug: 'shop',
    name: 'Inside the shop',
    status: 'built',
    statusText: 'In the build since 24 October. Built and packaged; not accepted until Nic has played it.',
    image: fShopKai,
    imageAlt: 'Kai from behind inside the shop: coral walls, a pale counter, shelves of pots, a window on the right.',
    painting: pShop,
    frames: [
      { src: fShopDoor, alt: 'The shop door open under its stone arch, shelves of jars inside.', caption: 'Through the door under the awning.' },
      { src: fShopRoom, alt: 'The shop interior from the door: the counter, the bell, shelves of jars and a bottle.', caption: 'The bell on the counter has no clapper.' },
    ],
    body: 'Through the door under the awning. Coral walls, a pale counter with a bell, two shelves of jars and bottles, and one bright window. The second interior, built the way the chapel was.',
  },
  {
    slug: 'lumina-garden',
    name: 'Lumina\'s still garden',
    status: 'built',
    statusText: 'In the build since 24 October. Built and packaged; not accepted until Nic has played it.',
    image: fGardenKai,
    imageAlt: 'Kai from behind in the walled rooftop garden: flower beds, a bench, a potted plant, the headland across the bay.',
    painting: pGarden,
    frames: [
      { src: fGardenRoseDoor, alt: 'A rose-coloured door in an arched wall at the end of the street.', caption: 'The way in: the rose door on the street, an alley of steps, a ladder.' },
      { src: fGardenFountain, alt: 'The garden from the ladder: a dry stone fountain, flower beds, a bench by the far wall.', caption: 'The dry fountain.' },
      { src: fGardenView, alt: 'Rooftops below the garden wall and the lavender headland across the blue bay.', caption: 'The view out, over the town.' },
    ],
    body: 'The walled rooftop garden where Kai wakes in the story: a stone bench, a dry fountain, beds of blue flowers, potted plants, and the bay over the wall. It is reached from the street, through a rose-coloured door, up an alley of steps and a ladder. It belongs to the Lumina estate, and the estate is still shut.',
  },
  {
    slug: 'estate-approach',
    name: 'The estate approach',
    status: 'built',
    statusText: 'In the build since 25 October. Nic accepted it.',
    image: fEstateFoot,
    imageAlt: 'The road from below: tiers of retaining walls with lamps, cypresses and the estate house at the top.',
    painting: pEstate,
    frames: [
      { src: fEstateRoad, alt: 'The road climbing along a high wall to a shut iron gate, a parapet over the sea on the right.', caption: 'The road to the gate, as painting A framed it.' },
      { src: fEstateViewBack, alt: 'From the gate, the parapet and the town and sea beyond.', caption: 'The view back from the gate.' },
      { src: fEstateGateLine, alt: 'Kai at the shut gate. A line reads: The Lumina Estate is home to the region\'s nobility. You have no business here... yet.', caption: 'The gate stays shut.' },
    ],
    body: 'A road from the top of the town up to the Lumina gate, between retaining walls and formal stonework, with lamps, a statue in an alcove, cypresses and a view back over the bay. It was built from one of three paintings. The gate stays shut. Try it and a line says you have no business here, yet. It is the first thing in the game Kai cannot do.',
  },
  {
    slug: 'opening-desert',
    name: 'The opening desert',
    status: 'now',
    statusText: 'A first slice, built 26 October. Reached only from a development menu. Nobody has played it yet.',
    image: fDesertArrival,
    imageAlt: 'Kai small in a wide desert, terracotta rocks on the left, a long flat shape on the far ridge.',
    frames: [
      { src: fDesertKai, alt: 'Kai from behind on the sand, facing the shape on the ridge.', caption: 'Where Kai arrives, facing it.' },
      { src: fDesertRocks, alt: 'Tall terracotta rocks, Kai small beside them.', caption: 'The rocks.' },
    ],
    body: 'Where the game will begin: Kai walking in a desert until he falls, before he wakes in the garden. A small walkable patch of sand, rocks, dry shrubs and dunes, 7.4 kilometres from the town on the same map and hidden from it by distance. On the far ridge is a flat outline, a proposed detail and nothing more. No tremors, no footprints, no story yet.',
  },

  {
    slug: 'long-road',
    name: 'The Long Road',
    status: 'now',
    statusText: 'Walkable from the harbour in Demo 0.1.0. Nic said par7 looked good on 28 October. Par9 adds river motion driven by wind; packaged checks passed, but Nic has not accepted the newer build.',
    image: fLongRoadArrival,
    imageAlt: 'Kai on a road through golden hills, cypress trees and pale houses, with the Arc and lavender ranges beyond.',
    frames: [
      { src: fPar9River, alt: 'Kai beside the river, facing pale arches through reeds and golden grass.', caption: 'Par9 packaged river check. The recorded sequence shows the water bands moving with wind; this is one still frame.' },
      { src: fPar7Road, alt: 'Kai beside pale roadside blocks, with golden grass and olive trees on the hill.', caption: 'Par7 packaged walk, 28 October. Wind is enabled on the Long Road; this still frame does not show its motion.' },
      { src: fB1LongRoad, alt: 'Kai at the Long Road arrival, between low stone walls with cypresses and a red-roofed house ahead.', caption: 'B1 Development package, 27 October. The review jumps Kai here; this does not show a walk from the town.' },
      { src: fLongRoadRepair, alt: 'Kai approaches three figures and a broken cart beneath an olive tree.', caption: 'The repair stop, under an olive. Long Road 6, from the packaged game.' },
      { src: fLongRoadRiver, alt: 'Turquoise water and reeds beneath pale river arches, with the Arc rising beyond.', caption: 'The river has bends, reeds and glints. The straight banks still show in places.' },
      { src: fLongRoadHollow, alt: 'Kai above a rectangular pool inside stacked stone walls, surrounded by golden grass.', caption: 'The hollow: warmer light, but the stacked blocks still read as a quarry. Not finished scenery.' },
      { src: fLongRoad, alt: 'Kai at the Long Road arrival in the first packaged blockout.', caption: 'Before: the first package, 26 October. Movement and layout were accepted as a base.' },
    ],
    body: 'An exploration loop, 245 by 140 metres: two branches, three river crossings, a cart to repair, a hidden hollow and a return to the village. The boxes have gained stone walls, houses, olives, cypresses, grass and longer shadows. The winch, seal and cart react, and residents have lines for the return. The coast road now joins it to the harbour, without a fade or menu. Nic played the demo candidate and asked for further movement, resident and sea work. Par7 brought wind in the grass, reeds and trees, shore wrack and regional weather blending. Nic tested it and said it looked good. Par9 adds river bands that drift and break with the wind; their motion is visible in packaged captures. The town stays calm and overcast is a development option. Par9 still needs his acceptance. Continue restores saved campaign positions along the route; the development area picker deliberately keeps its travel out of that save. Route changes remain session-only.',
  },
  {
    slug: 'coast-road',
    name: 'The coast road',
    status: 'built',
    statusText: 'In Demo 0.1.0, released 27 October. The frame below is from the later par2 Development package.',
    image: fPar2Causeway,
    imageAlt: 'Kai on a long pale causeway over blue water, with golden hills and a small settlement ahead.',
    body: 'A 1.16 kilometre causeway from the east edge of the harbour quay, through a gate and out to the Long Road. The packaged walk goes from the quay to the road and back without a fade, door or menu. Nic found the journey long in the demo candidate; a pass through the route is not the same as a settled travel design.',
  },
  {
    slug: 'cove-settlement',
    name: 'A settlement in the cove',
    status: 'now',
    statusText: 'Nic approved the par7 ground wash, resident positions and hall-door framing. Par9 adds a furnished hall and revised path surfaces; packaged checks passed, acceptance remains open. Not in Demo 0.1.0.',
    image: fPar9Settlement,
    frames: [
      { src: fPar9Hall, alt: 'Kai in the hall, with ledger tables, benches, a lectern and stools on a violet tiled floor.', caption: 'Inside the hall, par9 packaged door check. The furnishings are in; the grey patch high on the back wall remains unresolved.' },
      { src: fPar7Settlement, alt: 'Kai on the jetty facing the par7 settlement.', caption: 'Par7, 28 October. Nic said the look was good and kept the ground wash and resident positions.' },
      { src: fPar2Settlement, alt: 'Kai on the jetty facing the earlier settlement blockout.', caption: 'Before: par2, early on 28 October, before the sea treatment and ground wash.' },
    ],
    imageAlt: 'The settlement from the ridge: pale houses, red roofs, terraces and a long jetty across blue water.',
    body: 'A small settlement at the foot of the ridge, with a jetty, houses, a hall and five placeholder residents. Nic kept the ground wash, the hall keeper and gate watcher positions, and the hall-door framing after testing par7. Par8 and par9 add indoor climate and a furnished hall: benches, ledger tables, a lectern, stools and a hearth. The packaged check enters the hall, settles inside and returns outdoors. The path outlines are gone, but the paths now read faintly from the ridge. A grey patch on the hall wall remains unresolved. Its figures and dialogue are still stand-ins; par9 awaits Nic’s verdict.',
  },
];

export const courtyardConcept = pCourtyardConcept;
