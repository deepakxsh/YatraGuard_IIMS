import os
import numpy as np
import librosa
from sklearn.metrics.pairwise import cosine_similarity

SAMPLE_RATE = 22050
N_MFCC = 40
THRESHOLD = 0.85

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PANIC_DIR = os.path.join(BASE_DIR, "data", "sure_panic")

def extract_signature(file_path):
    y, sr = librosa.load(file_path, sr=SAMPLE_RATE)
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=N_MFCC)
    return np.mean(mfcc, axis=1)

# Preload panic fingerprints
PANIC_SIGNATURES = []
for f in os.listdir(PANIC_DIR):
    if f.endswith(".wav"):
        PANIC_SIGNATURES.append(extract_signature(os.path.join(PANIC_DIR, f)))

def sure_shot_panic(audio):
    mfcc = librosa.feature.mfcc(y=audio, sr=SAMPLE_RATE, n_mfcc=N_MFCC)
    sig = np.mean(mfcc, axis=1).reshape(1, -1)

    for p in PANIC_SIGNATURES:
        score = cosine_similarity(sig, p.reshape(1, -1))[0][0]
        if score > THRESHOLD:
            return True, score

    return False, None
