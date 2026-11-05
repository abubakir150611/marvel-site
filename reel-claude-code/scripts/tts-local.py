"""
Запасная локальная озвучка: голос Piper «Dmitri» (ru_RU, датасет CC0), без внешних сервисов.
Нужна, когда бесплатная очередь ElevenLabs занята. Основной голос ролика — ElevenLabs Pavel.

Пишет public/reel/voiceover.mp3 и src/vo-words.json ({"words": [{text, start, end}]}, секунды).
Тайминги слов: паузы в звуке сопоставляются со знаками препинания, внутри отрезка —
пропорционально длине слов (логика из видеозащиты WasteZero).

Подготовка (один раз):
  python3 -m venv venv && venv/bin/pip install piper-tts soundfile numpy
  curl -L -o dmitri.tar.bz2 https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-ru_RU-dmitri-medium.tar.bz2
  tar xjf dmitri.tar.bz2
Запуск (из папки reel-claude-code): venv/bin/python scripts/tts-local.py <папка_модели>
"""
import json
import os
import re
import subprocess
import sys
import tempfile

import numpy as np
import soundfile as sf
from piper import PiperVoice, SynthesisConfig

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
MODEL_DIR = sys.argv[1]
VOICE = os.path.basename(MODEL_DIR.rstrip("/")).replace("vits-piper-", "")
SR = 22050
voice = PiperVoice.load(os.path.join(MODEL_DIR, f"{VOICE}.onnx"))
CFG = SynthesisConfig(length_scale=0.93, noise_scale=0.62, noise_w_scale=0.8)  # бодрее, чем в защите: темп рилса


def synth(text):
    chunks = list(voice.synthesize(text, syn_config=CFG))
    return np.concatenate([c.audio_float_array for c in chunks]).astype(np.float32)


def rms_frames(x, win=int(0.02 * SR)):
    n = len(x) // win
    return np.sqrt(np.mean(x[: n * win].reshape(n, win) ** 2, axis=1) + 1e-12), win


def trim(x, thr=0.012):
    r, win = rms_frames(x)
    on = np.where(r > thr)[0]
    if not len(on):
        return x
    return x[max(0, on[0] * win - int(0.03 * SR)) : min(len(x), (on[-1] + 1) * win + int(0.05 * SR))]


def pauses(x, thr=0.01, min_len=0.07):
    r, win = rms_frames(x)
    quiet = r < thr
    out, i = [], 0
    while i < len(quiet):
        if quiet[i]:
            j = i
            while j < len(quiet) and quiet[j]:
                j += 1
            s, e = i * win / SR, j * win / SR
            if e - s >= min_len and i > 0 and j < len(quiet):
                out.append((s, e))
            i = j
        else:
            i += 1
    return out


def word_times(words, x):
    dur = len(x) / SR
    weight = lambda w: 0.6 + len(re.sub(r"[^\w]", "", w))
    breaks = [k for k, w in enumerate(words[:-1]) if re.search(r"[,:;…]$", w) or words[k + 1] == "—"]
    total = sum(weight(w) for w in words)
    cum = np.cumsum([weight(w) for w in words])
    found = pauses(x)
    cuts, used = [], set()
    for k in breaks:
        expect = cum[k] / total * dur
        best = None
        for idx, (s, e) in enumerate(found):
            if idx in used or (cuts and s <= cuts[-1][2]):
                continue
            if best is None or abs((s + e) / 2 - expect) < abs(sum(found[best]) / 2 - expect):
                best = idx
        if best is not None and abs(sum(found[best]) / 2 - expect) < 0.9:
            used.add(best)
            cuts.append((k, found[best][0], found[best][1]))
    out, w0, t0 = [], 0, 0.0
    for k, s, e in cuts + [(len(words) - 1, dur, dur)]:
        seg = words[w0 : k + 1]
        ws = [weight(w) for w in seg]
        t = t0
        for w, wt in zip(seg, ws):
            d = (s - t0) * wt / sum(ws)
            out.append({"text": w, "start": round(t, 3), "end": round(t + d * 0.92, 3)})
            t += d
        w0, t0 = k + 1, e
    return out


paragraphs = json.loads(subprocess.run(["node", "-e", 'import("./scripts/script.mjs").then(m=>console.log(JSON.stringify(m.PARAGRAPHS)))'], cwd=ROOT, capture_output=True, text=True, check=True).stdout)
chunks, words, t = [], [], 0.0
for pi, para in enumerate(paragraphs):
    for si, sent in enumerate(re.split(r"(?<=[.?!])\s+", para.replace("«", "").replace("»", ""))):
        x = trim(synth(sent))
        ws = [w for w in sent.split(" ") if w]
        for w in word_times(ws, x):
            if w["text"] != "—":
                words.append({"text": w["text"], "start": round(t + w["start"], 3), "end": round(t + w["end"], 3)})
        chunks.append(x)
        t += len(x) / SR
        gap = 0.36 if sent.endswith("?") else 0.28
        chunks.append(np.zeros(int(gap * SR), dtype=np.float32))
        t += gap
audio = np.concatenate(chunks[:-1])
audio = audio / np.max(np.abs(audio)) * 0.9
os.makedirs(os.path.join(ROOT, "public/reel"), exist_ok=True)
with tempfile.TemporaryDirectory() as tmp:
    wav = os.path.join(tmp, "vo.wav")
    sf.write(wav, audio, SR)
    af = "highpass=f=70,equalizer=f=180:t=q:w=1:g=2,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120,loudnorm=I=-18:TP=-2:LRA=9,aresample=48000"
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", wav, "-af", af, "-ac", "1", "-c:a", "libmp3lame", "-b:a", "160k", os.path.join(ROOT, "public/reel/voiceover.mp3")], check=True)
json.dump({"source": f"piper {VOICE}", "words": words}, open(os.path.join(ROOT, "src/vo-words.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"Голос: {len(audio) / SR:.1f} с, {len(words)} слов · Piper {VOICE}")
