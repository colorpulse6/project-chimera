"""Encode review-sheet strip frames into one site clip, no burned-in labels.
  python encode_clip.py <sheet dir> <out.mp4> <poster.jpg> [--shots a,b,c] [--poster shot:frame] [--crop w:h:x:y] [--crf N]
Shots play in the order given (default: manifest order). Frames are concatenated at their captured times (manifest),
30 fps H.264, faststart. --crop runs before scaling back to the capture size (used to cut the area picker's DEV tag)."""
import argparse, json, pathlib, subprocess
ap = argparse.ArgumentParser()
ap.add_argument('sheet'); ap.add_argument('out'); ap.add_argument('poster')
ap.add_argument('--shots', default=''); ap.add_argument('--poster-frame', default='')
ap.add_argument('--crop', default=''); ap.add_argument('--crf', default='24')
a = ap.parse_args()
sheet, out, poster = (pathlib.Path(p).resolve() for p in (a.sheet, a.out, a.poster))
FF = '/opt/homebrew/bin/ffmpeg'
m = json.loads((sheet / 'manifest.json').read_text())
by_name = {s['name']: s for s in m['shots'] if len(s.get('frames') or []) > 1}
shots = [by_name[n] for n in a.shots.split(',')] if a.shots else list(by_name.values())
lines = []
for s in shots:
    fr = s['frames']
    for i, f in enumerate(fr):
        dur = (fr[i + 1]['time'] - f['time']) if i + 1 < len(fr) else 1 / 15
        lines += [f"file '{pathlib.Path(f['file']).resolve()}'", f'duration {min(max(dur, 1 / 60), 1.0):.8f}']
lines.append(f"file '{pathlib.Path(shots[-1]['frames'][-1]['file']).resolve()}'")
listing = sheet / 'site-frames.txt'; listing.write_text('\n'.join(lines) + '\n')
w, h = m.get('width', 1280), m.get('height', 720)
vf = (f'crop={a.crop},' if a.crop else '') + f'scale={w}:{h}:flags=lanczos'
subprocess.run([FF, '-hide_banner', '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', str(listing), '-vf', vf, '-r', '30',
                '-c:v', 'libx264', '-preset', 'slow', '-crf', a.crf, '-pix_fmt', 'yuv420p', '-an', '-movflags', '+faststart', str(out)], check=True)
ps, pf = (a.poster_frame.split(':') if a.poster_frame else (shots[0]['name'], '0'))
src = pathlib.Path(by_name[ps]['frames'][int(pf)]['file'])
subprocess.run([FF, '-hide_banner', '-loglevel', 'error', '-y', '-i', str(src), '-vf', vf, '-q:v', '3', str(poster)], check=True)
print(out, subprocess.run(['/opt/homebrew/bin/ffprobe', '-v', 'error', '-show_entries', 'format=duration,size', '-of', 'default=nw=1', str(out)],
                          capture_output=True, text=True).stdout.strip().replace('\n', ' '))
