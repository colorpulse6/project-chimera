#!/usr/bin/env python
"""The hum: a slow, ominous drone for the Chimera site.

Procedural, no samples. Three detuned low voices in D, a sub underneath, a
minor-second shimmer that comes and goes, one far high partial, a breath of
filtered noise, and a long reverb. The last eight seconds crossfade into the
first eight so it loops without a seam.

Usage:  python tools/hum.py out.wav [--seconds 180] [--seed 7]
"""
import argparse
import numpy as np
from scipy.signal import fftconvolve, butter, sosfilt
from scipy.io import wavfile

SR = 44100


def env(t, attack, hold_until, release, total):
    """Slow fade in, hold, slow fade out, all in seconds."""
    a = np.clip(t / max(attack, 1e-6), 0, 1)
    r = np.clip((total - t) / max(release, 1e-6), 0, 1)
    return np.minimum(a, r) * (t <= total)


def voice(t, f, detune_cents=0.0, harmonics=(1, 0.5, 0.25, 0.12, 0.06), drift=0.0, rng=None):
    """A soft saw-ish tone from a few harmonics with slow pitch drift."""
    f = f * 2 ** (detune_cents / 1200)
    if drift and rng is not None:
        # a random slow walk in pitch, a few cents, so nothing is perfectly still
        n = len(t)
        knots = rng.normal(0, drift, size=max(8, n // (SR * 20)))
        walk = np.interp(np.linspace(0, 1, n), np.linspace(0, 1, len(knots)), np.cumsum(knots))
        f_t = f * 2 ** (walk / 1200)
        phase = 2 * np.pi * np.cumsum(f_t) / SR
    else:
        phase = 2 * np.pi * f * t
    out = np.zeros_like(t)
    for k, a in enumerate(harmonics, start=1):
        out += a * np.sin(k * phase)
    return out / sum(harmonics)


def lowpass(x, hz, order=2):
    sos = butter(order, hz / (SR / 2), btype="low", output="sos")
    return sosfilt(sos, x)


def highpass(x, hz, order=2):
    sos = butter(order, hz / (SR / 2), btype="high", output="sos")
    return sosfilt(sos, x)


def reverb(x, seconds=4.0, rng=None, wet=0.5):
    """Convolution with an exponentially decaying noise tail."""
    n = int(seconds * SR)
    tail = rng.normal(0, 1, n) * np.exp(-np.linspace(0, 7, n))
    tail = lowpass(tail, 2500)
    tail /= np.sqrt(np.sum(tail ** 2))
    y = fftconvolve(x, tail)[: len(x)]
    return (1 - wet) * x + wet * y


def make(seconds, seed):
    rng = np.random.default_rng(seed)
    n = int(seconds * SR)
    t = np.arange(n) / SR
    D2 = 73.416  # D2
    sub = 0.55 * np.sin(2 * np.pi * (D2 / 2) * t)  # D1
    sub += 0.15 * np.sin(2 * np.pi * (D2 / 2) * 1.5 * t)  # a fifth under, faint

    # three detuned voices on D2, slow breathing amplitude
    breath = 0.75 + 0.25 * np.sin(2 * np.pi * t / 23.0)
    drone = (
        voice(t, D2, -6, drift=0.8, rng=rng)
        + voice(t, D2, +5, drift=0.8, rng=rng)
        + voice(t, D2 * 2, -3, harmonics=(1, 0.3, 0.1), drift=0.6, rng=rng) * 0.5
    ) * breath / 2.5

    # the fifth, A2, steady, a little quieter
    fifth = voice(t, D2 * 1.5, 0, harmonics=(1, 0.4, 0.15), drift=0.5, rng=rng) * 0.35

    # the minor second, Eb3, arriving in the middle and leaving: the wrong note
    Eb3 = D2 * 2 * 2 ** (1 / 12)
    shimmer = voice(t, Eb3, 0, harmonics=(1, 0.2), drift=1.5, rng=rng)
    shimmer *= 0.22 * env(t, 35, 0, 35, seconds) * (0.5 + 0.5 * np.sin(2 * np.pi * t / 41.0 - 1.2)) ** 2

    # one far high partial, D6, tremolo so slow it reads as something turning
    far = np.sin(2 * np.pi * D2 * 16 * t) * 0.045 * (0.5 + 0.5 * np.sin(2 * np.pi * t / 17.0)) ** 3

    # a breath of noise: filtered, very low, like grain
    noise = rng.normal(0, 1, n)
    noise = lowpass(highpass(noise, 200), 1200) * 0.03 * (0.6 + 0.4 * np.sin(2 * np.pi * t / 31.0 + 0.7))

    # occasional ticks: the clock that no one winds. Sparse, quiet, dry.
    ticks = np.zeros(n)
    for i in range(int(seconds / 9)):
        at = int((9 * i + rng.uniform(2, 7)) * SR)
        if at + 2000 < n:
            k = np.arange(2000)
            ticks[at : at + 2000] += 0.08 * np.sin(2 * np.pi * 1900 * k / SR) * np.exp(-k / 120)

    mix = sub + drone + fifth + shimmer + far + noise
    mix = lowpass(mix, 1800)
    mix = reverb(mix, 5.0, rng, wet=0.45) + ticks

    # stereo: slightly different reverb tails per side
    left = reverb(mix, 2.2, np.random.default_rng(seed + 1), wet=0.25)
    right = reverb(mix, 2.7, np.random.default_rng(seed + 2), wet=0.25)
    st = np.stack([left, right], axis=1)

    # seamless loop: crossfade the last 8 s into the first 8 s
    x = int(8 * SR)
    fade = np.linspace(0, 1, x)[:, None]
    st[:x] = st[:x] * fade + st[-x:] * (1 - fade)
    st = st[:-x]

    # global fade in over 4 s is not wanted for a loop, so none. Normalise to -3 dBFS.
    st = st / np.max(np.abs(st)) * 10 ** (-3 / 20)
    return st


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("out")
    ap.add_argument("--seconds", type=float, default=180)
    ap.add_argument("--seed", type=int, default=7)
    a = ap.parse_args()
    audio = make(a.seconds + 8, a.seed)
    wavfile.write(a.out, SR, (audio * 32767).astype(np.int16))
    print(a.out, f"{len(audio) / SR:.1f}s")
