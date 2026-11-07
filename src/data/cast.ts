/* The written cast: companions and the people of the wider story, as designed in 2025
   and drawn once that May as portraits. None of them is in the town's hand yet. Until a
   person is drawn in that hand, the record shows the old portrait as ink and gives it a
   void, in the townsfolk's language. The void positions are fixed so they do not move
   between visits. */
import type { ImageMetadata } from 'astro';

const ills = import.meta.glob<{ default: ImageMetadata }>('../assets/media/orig-*-illustration.jpg', { eager: true });
const ill = (key: string) => ills[`../assets/media/orig-${key}-illustration.jpg`]?.default;

export type Written = {
  key: string;
  name: string;
  epithet: string;
  text: string;
  image?: ImageMetadata;
  /** the void: centre x%, centre y%, radius (scaled to rem by the page) */
  void: [number, number, number];
  state: 'built' | 'now' | 'next';
  stateText: string;
  href?: string;
};

export const written: Written[] = [
  { key: 'rex', name: 'Rex', epithet: 'The pragmatic scavenger', void: [68, 30, 9], state: 'now', stateText: 'Written; stands in a checkpoint, parked', href: '#rex',
    text: 'Patched leather with glowing conduits, goggles made from old sensors, a pneumatic tool that fires charged bolts. Calls magic broken machinery and is usually right. Found in the ruins outside Havenwood. In the internal builds he already follows Kai, badly, and flinches at the desert’s tremors.' },
  { key: 'seraph', name: 'Seraph', epithet: 'The awakened enforcer', void: [34, 62, 8], state: 'next', stateText: 'Written, drawn in May 2025',
    text: 'A Corrector who saw one Nullification too many. Still wears the under-suit, has defaced the armour. Precise, formal, and bitter about it.' },
  { key: 'zenith', name: 'Zenith', epithet: 'The glitch-witch', void: [60, 22, 10], state: 'next', stateText: 'Written, drawn in May 2025',
    text: 'Lives where the distortions cluster. Mismatched layers covered in corrupted glyphs and blinking salvage, hair streaked by exposure. Speaks in fragments that turn out to be true.' },
  { key: 'valerian', name: 'Valerian', epithet: 'The archivist', void: [40, 72, 7], state: 'next', stateText: 'Written, drawn in May 2025',
    text: 'A scholar, possibly a former Keeper of the Lineage, with a satchel of forbidden texts and a decoder for old machines. Believes in verifiable truth over dogma, which in this world is a dangerous habit.' },
  { key: 'lyra', name: 'Lyra', epithet: 'The apostate, or one of three Lyras', void: [52, 40, 11], state: 'next', stateText: 'Written three ways; undecided',
    text: 'A Lumina whose family faked her death to save her from correction. Wears a defaced sigil and hides the Mark in her eyes. Wants to rewrite the code she was born with. The 2025 documents use her name for three different people; which one she is remains open.' },
  { key: 'cog', name: 'Cog', epithet: 'The discarded construct', void: [50, 50, 12], state: 'next', stateText: 'Written, never drawn',
    text: 'Unit 734, a precursor maintenance robot that became conscious by watching the resets. Patched from every era, one eye flickering. Asks whether your will is any different from its programming, and waits for an answer.' },
  { key: 'cora', name: 'Cora', epithet: 'The princess', void: [66, 68, 8], state: 'next', stateText: 'Written, drawn in May 2025',
    text: 'Youngest of House Lumina, not glitched, cheerful, curious, and tired of the gilded walls. Her luck is The System keeping her blessed, though she does not know it.' },
  { key: 'kaelen', name: 'Kaelen Lumina', epithet: 'The reality weaver', void: [30, 28, 9], state: 'next', stateText: 'Written, drawn in May 2025',
    text: 'A lord who understands The System as a machine and wants to become its source code. The nearest thing the story has to a villain who is not the architect.' },
  { key: 'aris', name: 'Aris Thorne', epithet: 'The technocrat', void: [70, 56, 8], state: 'next', stateText: 'Written, drawn in May 2025',
    text: 'A Lumina by birth, married into an engineering house on Ferrus Magna. Rejects the mysticism and wants the technology.' },
  { key: 'valerius', name: 'Valerius Lumina', epithet: 'The whispering glitch', void: [48, 18, 9], state: 'next', stateText: 'Written, drawn in May 2025',
    text: 'A Glitched Scion in unstable symbiosis with a fragment of precursor AI at a Whispering Ruin. A cult has grown around him. He may not want it.' },
].map((w) => ({ ...w, image: ill(w.key) }));

export const systemLines = [
  'order is absolute',
  'deviation is error',
  'anomaly KAI_7.34 designated for nullification',
  'final processing deferred',
  'temporal anchor stabilized',
  'the town is stable',
  'nobody remarks on the voids',
  'we have maintained your last instruction',
  'correction is care',
];
