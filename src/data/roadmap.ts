export type Item = { text: string; detail?: string };
export const done: Item[] = [
  { text: 'Art direction converged', detail: 'A painted world, a drawn hero, and the drawing sometimes fails. September 2026.' },
  { text: 'Kai made from the illustration', detail: 'Image-to-3D, the drawing projected back as texture, rigged, with walk and run. 17 October.' },
  { text: 'Moved to Unreal Engine 5', detail: 'Native build of the Havenwood courtyard with Kai and one resident. 19 to 20 October.' },
  { text: 'The look locked', detail: 'Ink lines, five value bands, paper grain, flat painted surfaces, no global illumination. 20 October.' },
  { text: 'Townsfolk from the drawing', detail: 'Five residents rebuilt through the image-to-3D route with built heads and hands. 21 to 22 October.' },
  { text: 'Modular town kit and the first street', detail: 'Seventeen pieces on a one-metre grid; the street laid out as a text file. 21 October.' },
  { text: 'Packaged Mac build', detail: 'Havenwood, 22 October, with title and pause menus and a local save.' },
  { text: 'First recording and movement clips', detail: 'Forty seconds of the build on the home page; three loops on the characters page. 22 October.' },
  { text: 'Story, world and mechanics written up', detail: 'The 2025 design documents condensed onto this site, marked as designed rather than built. 22 October.' },
];
export const now: Item[] = [
  { text: 'Seaside lane and harbour', detail: 'Two new places on one continuous map, with quay, water and boat pieces added to the kit.' },
  { text: 'Six new townsfolk', detail: 'From a second lineup drawing, placed in the new places with names from the cast catalogue.' },
  { text: 'Game side', detail: 'Named talk prompts, walkers that cross between places, the place name on arrival, saving where you stand.' },
  { text: 'Figure polish', detail: 'The Child\'s bob as hair, the Fisherman\'s hat flatter, the Shopkeeper\'s collar edge.' },
];
export const next: Item[] = [
  { text: 'Church square, shop, hill village and chapel in the new engine', detail: 'The paintings exist; the places get rebuilt from the kit.' },
  { text: 'Doors that open', detail: 'Step through a door into a dim interior, as the chapel did in the earlier engine.' },
  { text: 'The seam', detail: 'The moment the drawing of Kai fails. Designed on paper, removed once as a glitch, to be done properly.' },
  { text: 'Camera collision on the courtyard tree', detail: 'The camera passes inside the canopy and shows the shard mesh. Seen in the first recording.' },
  { text: 'Frame rate', detail: 'The packaged build runs around 25 frames a second on the M1 Max with the look on. The bottleneck is not shading. Open.' },
  { text: 'Story beats and Elara', detail: 'Kai\'s search for his sister, the first scenes that are not a town.' },
];
