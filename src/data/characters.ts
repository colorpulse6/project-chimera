import rexW1 from '../assets/media/w1-rex-river.jpg';
import par16Swept from '../assets/media/par16-b6-swept.jpg';
import par16Reed from '../assets/media/par16-b7-reed-net.jpg';
import type { ImageMetadata } from 'astro';
import par16Mending from '../assets/media/par16-b5-evening-mending.jpg';
import par16Street from '../assets/media/par16-b4-street-conversation.jpg';
import rexWake from '../assets/media/par15-v22-wake-return.jpg';
import rexHighPass from '../assets/media/par15-v23-high-pass-lookback.jpg';

import kaiDrawing from '../assets/media/kai-drawing.jpg';
import kaiHero from '../assets/media/kai-b11-street.jpg';
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
import salDrawing from '../assets/media/sal-drawing.jpg';
import salFull from '../assets/media/sal-full.jpg';
import salFace from '../assets/media/sal-face.jpg';
import rowanDrawing from '../assets/media/rowan-drawing.jpg';
import rowanFull from '../assets/media/rowan-full.jpg';
import rowanFace from '../assets/media/rowan-face.jpg';
import fridaDrawing from '../assets/media/frida-drawing.jpg';
import fridaFull from '../assets/media/frida-full.jpg';
import fridaFace from '../assets/media/frida-face.jpg';
import tomDrawing from '../assets/media/tom-drawing.jpg';
import tomFull from '../assets/media/tom-full.jpg';
import tomFace from '../assets/media/tom-face.jpg';
import annaDrawing from '../assets/media/anna-drawing.jpg';
import annaFull from '../assets/media/anna-full.jpg';
import annaFace from '../assets/media/anna-face.jpg';
import edithDrawing from '../assets/media/edith-drawing.jpg';
import edithFull from '../assets/media/edith-full.jpg';
import edithFace from '../assets/media/edith-face.jpg';
import gretaDrawing from '../assets/media/greta-drawing.jpg';
import gretaFull from '../assets/media/cog-greta.jpg';
import gretaFace from '../assets/media/greta-face.jpg';
import silasDrawing from '../assets/media/silas-drawing.jpg';
import silasFull from '../assets/media/silas-full.jpg';
import silasFace from '../assets/media/silas-face.jpg';
import ferrisDrawing from '../assets/media/ferris-drawing.jpg';
import ferrisFull from '../assets/media/ferris-full.jpg';
import ferrisFace from '../assets/media/ferris-face.jpg';
import strangerDrawing from '../assets/media/stranger-drawing.jpg';
import strangerFull from '../assets/media/stranger-b11-full.jpg';
import strangerFace from '../assets/media/stranger-b11-face.jpg';
import kaiWalk from '../assets/media/kai-walk-strip.jpg';

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
    'Since 25 October he moves on motion-capture clips retargeted to his own skeleton. The still cape and smaller walking arm swing were packaged on 26 October. Nic then played the dressed Long Road and found the upright jump worse. The next package gives a running jump forward lean and a raised knee, with a short landing dip in place of the deep crouch. Jump height and air control are unchanged. The covered arm is held across his body, though the lifted cape can show the forearm at a run. Nic later reported hovering, shivering and a stiff stance in the demo candidate. The internal par2 build added foot and stance corrections and a modest forward reach of the visible arm in the jump, retained through par14. Sleeve and cloak stretching still limits the pose. Nic tested par7 on 28 October and said it looked good. The par14 package adds a persistent Reduce motion option for desert camera tremors. Keyboard preference checks passed; Nic’s later mouse and missing-shake reports remain unresolved. There is no new pose acceptance from those checks.',
    'The internal par16 checkpoints add sword-ready, slash, guard and hit actions. B3 replaces the short defeat stagger with a held kneel, with normal and Enter-skip returns checked separately. B4 checks guard, Tonic, victory and the enemy’s visible dissolution. The cape obscures lower-leg contact in game captures, and physical mouse commands remain unproved. B7 adds the visible Item count and healing amount. B8 makes the next enemy intent readable, with separate preparing and Heavy Strike labels. Nic accepted B9’s Next Kai label and projected return-time preview on 7 November. Scripted normal/reduced checks passed; physical input and real-time performance remain unproved. These remain internal Development checkpoints.',
    'At rest he is whole. The brief says the drawing of him sometimes fails; that part is designed but not yet in the game.',
  ],
  extra: { src: kaiWalk, caption: 'The walk, eight frames 0.43 seconds apart, from the batch 9 build of 25 October. Before the second pass of 26 October.' },
};

// Nic kept par7’s two repositioned settlement placeholders; par13 retains all five placeholders in the settlement now named Keepers’ Cove.
// They reuse an existing body and idle; no new drawing, portrait or settled
// dialogue to list.
export const townsfolk: Character[] = [
  {
    slug: 'well-woman',
    name: 'Well Woman',
    role: 'Draws water in the courtyard',
    place: 'Courtyard well; evening mending in Keepers’ Cove in internal B5',
    status: 'built',
    statusText: 'First figure through the drawing-to-game route, 21 October',
    drawing: wwDrawing, inGame: wwFull, face: wwFace,
    extra: { src: par16Mending, caption: 'Par16 B5, 4 November. The same Woman supports ivory cloth in the Cove household. Evening work, interruption and concealed return passed; cuffs, fingers and rigid cloth remain prototype limits.' },
    body: [
      'In internal B5 she mends in the Cove household between 18:00 and 22:00 on the game clock. She changes location only when the endpoints are out of view and clear of interaction; no walked commute is claimed. Approaching or talking holds her work pose, and the activity resumes afterward. Pause and Reduce motion also hold it. Her evening line is “Mind your cuffs.” The return to the well was checked.',
      'A tall woman in a teal dress with a swept bun and a round void in her hem. She was the test case for the townsfolk pipeline: generated body, built oval mask head with two eyes, built hands clasped in front. Her face was the hardest part; generated heads came out lumpy, so the head is modelled by hand and only the body carries the drawing.',
    ],
  },
  {
    slug: 'shopkeeper',
    name: 'Merchant Aldric',
    role: 'The Shopkeeper. Keeps the shop under the blue awning',
    place: 'Street preview in internal B3 onward; courtyard shop door in the earlier build',
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
    role: 'Sits with his cane on the church square bench',
    place: 'Church square in internal B7 onward; hill village in the earlier build',
    status: 'built',
    statusText: 'Rebuilt from the drawing on 22 October; moved up to the hill village the same evening',
    drawing: omDrawing, inGame: omFull, face: omFace,
    body: [
      'Internal B7 seats the same Old Man on the original church square bench, with cane and feet supported. His line changes from “One thing at a time.” to “The cart has rolled clear, then.” after the genuine cart repair and move. Wider milestone lines are not in B8; full contact and navigation remain unproved.',
      'A violet robe, a stoop, and a ring where the head should be. The ring is built as a torus so it reads clean from every angle; the cane stayed from the earlier version. He is the figure that shows what the masks-and-holes language can do with the least material.',
    ],
  },
  {
    slug: 'child',
    name: 'Child',
    role: 'Walks between the residents',
    place: 'Street preview in internal B3 onward; courtyard in the earlier build',
    status: 'built',
    statusText: 'Rebuilt from the drawing on 22 October; one of the two walkers',
    drawing: chDrawing, inGame: chFull, face: chFace,
    body: [
      'The internal B3 street preview checks walking and pauses between Rowan and Aldric, retained in B4 and B5. No goods transfer or complete navigation audit is claimed.',
      'A coral smock with a void at the chest and a brown bob. She is one of the two residents who walk a route instead of standing at a post, so the courtyard is never still. The bob reads as a cap at the moment; that is on the polish list.',
    ],
  },
  {
    slug: 'fisherman',
    name: 'Old Reed',
    role: 'The Fisherman. Carries a small net on the jetty',
    place: 'Keepers’ Cove in internal B7 onward; harbour in the earlier build',
    status: 'built',
    statusText: 'Rebuilt from the drawing on 22 October; given his name and the harbour the same evening',
    drawing: fiDrawing, inGame: fiFull, face: fiFace,
    extra: { src: par16Reed, caption: 'Par16 B7, 4 November. Old Reed keeps his net during dialogue on the Cove jetty. The short route is reviewed; the longer route and complete hand/net clearance are not.' },
    body: [
      'Internal B7 gives the same actor a small net sling and a short Cove jetty route. Walking, turns, nearby dialogue and resumed walking retain the net. Relaxed fingers and known contact crossings remain; this is not the proposed longer route or a hauling task.',
      'Blue tunic, wide trousers, a steep blue cone hat and a void at the shoulder. He walked the courtyard until the harbour was built, then stood by the boat. His hat is steeper than the drawing wants and is on the polish list.',
    ],
  },
  // From the second lineup drawing, 22 October. Placed in batch 1, moved in batch 2.
  {
    slug: 'sal',
    name: 'Sal',
    role: 'Dock worker, carries for the estate',
    place: 'Harbour, walks the quay to the lane foot',
    status: 'built',
    statusText: 'From the second lineup, 22 October; a walker',
    drawing: salDrawing, inGame: salFull, face: salFace,
    body: [
      'A slate-blue jacket over navy trousers, a flat cap, and a void through the chest. He walks between the quay and the foot of the lane with crates nobody opens.',
      '"A pace clear of the cargo, please. I\u2019d rather not learn your name by shouting for you."',
    ],
  },
  {
    slug: 'rowan',
    name: 'Innkeeper Rowan',
    role: 'Keeps The Weary Wanderer, airs every room',
    place: 'Street preview in internal B3 onward; seaside lane in the earlier build',
    status: 'built',
    statusText: 'From the second lineup, 22 October',
    drawing: rowanDrawing, inGame: rowanFull, face: rowanFace,
    body: [
      'A rust dress under a pale apron, a red bun, and a void in the apron. The cast notes had Rowan as a man; the drawing came back a woman, and she was kept.',
      '"Rowan, from The Weary Wanderer. Forgive me if I look pleased to see an unfamiliar face."',
    ],
  },
  {
    slug: 'frida',
    name: 'Frida',
    role: 'Sells fruit from a doorstep',
    place: 'Seaside lane, a doorstep',
    status: 'built',
    statusText: 'From the second lineup, 22 October',
    drawing: fridaDrawing, inGame: fridaFull, face: fridaFace,
    body: [
      'An ochre pinafore, a teal headscarf, and a round void in the skirt. Plums in one bowl, apples in another, and a reason for the second bowl.',
      '"Frida. It\u2019s a good day for plums. Not such a good day for keeping them cool."',
    ],
  },
  {
    slug: 'tom',
    name: 'Tom',
    role: 'Carries rumours, mostly secondhand',
    place: 'Street conversation in internal B3 onward; church terrace in the earlier build',
    status: 'built',
    statusText: 'From the second lineup, 22 October; a walker, moved to the church square in batch 2',
    drawing: tomDrawing, inGame: tomFull, face: tomFace,
    body: [
      'The B2 church-terrace walk remains an earlier checkpoint. Internal B3 moves him into a street exchange with Anna, with readable captions and quiet during approach, dialogue and pause, then resume. B4 retains the preview; a wider daily routine remains unfinished.',
      'A long olive coat, a flat cap, and a void through the coat. He has heard about lights near the ruins. He did not see them.',
      '"You\u2019re new here. I was going to tell you what I\u2019ve heard, but perhaps that can wait."',
    ],
  },
  {
    slug: 'anna',
    name: 'Anna',
    role: 'Watches which flowers have opened',
    place: 'Street conversation in internal B3 onward; hill-village basin in the earlier build',
    status: 'built',
    statusText: 'From the second lineup, 22 October; moved to the hill village in batch 2',
    drawing: annaDrawing, inGame: annaFull, face: annaFace,
    extra: { src: par16Street, caption: 'Par16 B4, 4 November. Anna’s caption and the existing Child are visible in the retained street preview. Full daily routines remain unfinished.' },
    body: [
      'A cream dress with a cape, a swept red ponytail, and a ring through the sleeve. She stands by the fountain basin with her back to the sea.',
      '"Did you notice the flowers by the fountain? No matter if you didn\u2019t. You can look another time."',
    ],
  },
  {
    slug: 'edith',
    name: 'Grandmother Edith',
    role: 'Does not give advice',
    place: 'Church square in the internal B2 preview; seaside lane in the earlier build',
    status: 'built',
    statusText: 'From the second lineup, 22 October',
    drawing: edithDrawing, inGame: edithFull, face: edithFace,
    extra: { src: par16Swept, caption: 'Par16 B6, 4 November. Edith beside the completed small patch. The paired progress frames are in the update; this is not a claim that the whole square is clean.' },
    body: [
      'B6 makes the small dirt patch beneath her broom visibly clear in ten increments. Pause holds progress; Reduce motion shows a quiet clear patch without awarding cleaning progress. Normal sweeping resumes with the remaining film. Fingers and physical bristle contact still need polish.',
      'A lavender cloak, a grey bun, and a crescent void at the hip. The smallest figure in the town and the oldest. She wished at the well once.',
      '"You may stop a moment. I won\u2019t assume you\u2019ve come for advice."',
    ],
  },
  {
    slug: 'greta',
    name: 'Greta',
    role: 'Keeps the Rusted Cog',
    place: 'The Rusted Cog, behind the bar',
    status: 'built',
    statusText: 'Drawn 24 October, in the build since 25 October',
    drawing: gretaDrawing, inGame: gretaFull, face: gretaFace,
    body: [
      'A navy dress, a coral apron with an arched void in it, a violet bun, and a cup held in both hands. Her drawing was a draft, made for Nic to correct. Nic accepted it as drawn, with no notes, so the bun, the apron and the cup stayed.',
      '"Welcome to the Rusted Cog. Greta. There\u2019s room for you, and no obligation to be interesting."',
    ],
  },
  {
    slug: 'silas',
    name: 'Father Silas',
    role: 'Keeps the chapel and its books',
    place: 'The chapel, inside',
    status: 'built',
    statusText: 'From the third lineup, in the build since 25 October',
    drawing: silasDrawing, inGame: silasFull, face: silasFace,
    body: [
      'Internal B7 adds a quiet hand and forearm bell gesture here in the chapel. Natural tolls, idle return, an active-pull pause and Reduce motion cancellation passed. Rope grip and wider bystander reactions are not established.',
      'A red robe, a cream stole in two bands, a round void at the chest, hands folded. The 2025 documents had a Silas who stood at a fence for three days saying the same thing. This one keeps the chapel, and the books, which have lasted through a good deal of mending.',
      '"Welcome. Silas. You needn\u2019t have a question to spend a little time here."',
    ],
  },
  {
    slug: 'ferris',
    name: 'Old Ferris',
    role: 'Saw lights near the ruins',
    place: 'The Rusted Cog',
    status: 'built',
    statusText: 'From the third lineup, in the build since 25 October',
    drawing: ferrisDrawing, inGame: ferrisFull, face: ferrisFace,
    body: [
      'An ochre coat with a crescent void, a grey-green shirt, a hat in one hand and a cane in the other, swept white hair. He saw lights moving near the ruins, like festival lanterns, when there was no festival. He does not mind the story being repeated. Improving it is another matter.',
      '"Before you ask, I said lights. The rest seems to have been added over drinks."',
    ],
  },
  {
    slug: 'stranger',
    name: 'Hooded Stranger',
    role: 'Does not speak',
    place: 'The Rusted Cog, at a corner table',
    status: 'now',
    statusText: 'Darker in the 26 October package. Nic has not accepted this look yet.',
    drawing: strangerDrawing, inGame: strangerFull, face: strangerFace,
    body: [
      'A taupe cloak, and a hood whose opening is the void, where a face would be. Every line the Stranger has is a stage direction. Nic asked for darker and more ominous. The 26 October package turns the cloak charcoal-violet, keeping its drawn folds. The drawing here is the earlier taupe version. The new look still awaits Nic’s eye.',
      '"[The hood turns towards Kai. The figure waits without speaking.]"',
    ],
  },
];

export const rexCheckpoint = {
  name: 'Rex, profile restored',
  statusText: 'W1, packaged 7 November: the missing profile is restored and Rex is visible at the River crossing. Bounded check only; no new Nic acceptance.',
  body: 'W1 restores the existing profile omitted from the B9 package. Rex loads beside Kai at the River crossing; the battle plan and return pass. He is outside the return screenshot, with route-history warnings retained. Other encounters and Nic’s own save were not played. Body, face, broad following and performance remain parked. Par16 starts from the accepted v21-a2 predecessor. The later Game22 and Game23 checks below remain historical evidence, with their failures and limits retained. They do not establish a full High Pass round trip, reliable stairs or hidden relocation. In par16 B2, Rex rejoined after the mechanical defeat-return, but this slice adds no Rex combat kit. B7 adds only a restrained upper-body response to natural desert tremors, returning to neutral and suppressed by Reduce motion. It does not reopen body, face or following work. Nic’s face-readability concern remains, and performance is unmeasured.',
  frames: [
    { src: rexW1, alt: 'Rex beside Kai at the River crossing, labelled Scouting.', caption: 'W1 private package, 7 November. Rex visible before the fight. The return screenshot misses him; this is not a wider following test.' },
    { src: rexHighPass, alt: 'Kai and Rex at the first High Pass steps, looking back towards the refuge.', caption: 'Game23, 3 November. Rex moved from arrival during this short pilot. This view does not prove a complete descent or climb back.' },
    { src: rexWake, alt: 'Kai and Rex back on the Long Road after defeat and wake-up.', caption: 'Earlier Game22 mechanical wake check. Its bounded result stands; the transition still needs visual proof.' },
  ],
};
