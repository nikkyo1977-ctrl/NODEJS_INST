// Procedural ambient background music generator
// Generates a soft, corporate-tech ambient track using pure synthesis
const { writeFileSync } = require('fs');
const path = require('path');

const SAMPLE_RATE = 44100;
const DURATION = 90; // seconds
const NUM_SAMPLES = SAMPLE_RATE * DURATION;
const buffer = new Float32Array(NUM_SAMPLES);

// Utility functions
function noteToFreq(note) {
  return 440 * Math.pow(2, (note - 69) / 12);
}

function sine(phase) {
  return Math.sin(2 * Math.PI * phase);
}

function triangle(phase) {
  const t = phase % 1;
  return 4 * Math.abs(t - 0.5) - 1;
}

function lowPassFilter(samples, cutoff, sampleRate) {
  const rc = 1.0 / (cutoff * 2 * Math.PI);
  const dt = 1.0 / sampleRate;
  const alpha = dt / (rc + dt);
  const output = new Float32Array(samples.length);
  output[0] = samples[0];
  for (let i = 1; i < samples.length; i++) {
    output[i] = output[i - 1] + alpha * (samples[i] - output[i - 1]);
  }
  return output;
}

// Ambient pad using layered detuned oscillators
function generatePad(freq, startSample, endSample, volume = 0.05) {
  const detune = [0, 0.003, -0.003, 0.007, -0.007];
  for (let i = startSample; i < endSample && i < NUM_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    const localT = (i - startSample) / SAMPLE_RATE;
    const dur = (endSample - startSample) / SAMPLE_RATE;
    
    // ADSR envelope
    const attack = 2.0;
    const release = 2.0;
    let env = 1;
    if (localT < attack) env = localT / attack;
    else if (localT > dur - release) env = (dur - localT) / release;
    env = Math.max(0, Math.min(1, env));
    
    let sample = 0;
    for (const d of detune) {
      const f = freq * (1 + d);
      sample += sine(t * f) * 0.2;
      sample += triangle(t * f * 0.5) * 0.1;
    }
    
    buffer[i] += sample * env * volume;
  }
}

// Soft bass drone
function generateDrone(freq, volume = 0.03) {
  for (let i = 0; i < NUM_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    // Slow LFO modulation
    const lfo = 1 + 0.02 * sine(t * 0.1);
    const sample = sine(t * freq * lfo) * 0.6 + sine(t * freq * 2 * lfo) * 0.2 + triangle(t * freq * 0.5 * lfo) * 0.2;
    
    // Fade in/out
    let env = 1;
    if (t < 3) env = t / 3;
    if (t > DURATION - 3) env = (DURATION - t) / 3;
    
    buffer[i] += sample * volume * env;
  }
}

// Soft arpeggio plucks
function generatePluck(freq, startSample, volume = 0.04) {
  const dur = SAMPLE_RATE * 1.5; // 1.5 second decay
  for (let i = 0; i < dur && (startSample + i) < NUM_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 3); // exponential decay
    const sample = sine(t * freq) * 0.7 + sine(t * freq * 2) * 0.2 + sine(t * freq * 3) * 0.1;
    buffer[startSample + i] += sample * env * volume;
  }
}

// --- Composition ---

// C minor pentatonic scale notes (ambient, moody, corporate)
const C3 = noteToFreq(48);  // C3
const Eb3 = noteToFreq(51); // Eb3
const F3 = noteToFreq(53);  // F3
const G3 = noteToFreq(55);  // G3
const Bb3 = noteToFreq(58); // Bb3
const C4 = noteToFreq(60);  // C4
const Eb4 = noteToFreq(63); // Eb4
const G4 = noteToFreq(67);  // G4

// Bass drone on C2
generateDrone(noteToFreq(36), 0.025);

// Evolving pad chords (change every ~15 seconds matching scene changes)
const padChords = [
  { notes: [C3, G3, C4], start: 0, end: 14 },       // Scene 1-2
  { notes: [Eb3, Bb3, Eb4], start: 12, end: 28 },    // Scene 2-3
  { notes: [F3, C4, G4], start: 26, end: 42 },       // Scene 3
  { notes: [G3, C4, Eb4], start: 40, end: 56 },      // Scene 4-5
  { notes: [Eb3, G3, Bb3], start: 54, end: 70 },     // Scene 5-6
  { notes: [F3, Bb3, Eb4], start: 68, end: 82 },     // Scene 6-7
  { notes: [C3, G3, C4], start: 78, end: 92 },       // Scene 7 (resolve)
];

for (const chord of padChords) {
  for (const note of chord.notes) {
    generatePad(note, chord.start * SAMPLE_RATE, chord.end * SAMPLE_RATE, 0.04);
  }
}

// Gentle arpeggio plucks every ~2 seconds
const arpeggioNotes = [C4, Eb4, G4, Eb4, C4, G3, Bb3, G3];
for (let t = 4; t < DURATION - 5; t += 2.5) {
  const noteIndex = Math.floor(t / 2.5) % arpeggioNotes.length;
  generatePluck(arpeggioNotes[noteIndex], Math.floor(t * SAMPLE_RATE), 0.025);
}

// High shimmer - very quiet high frequency atmosphere
for (let i = 0; i < NUM_SAMPLES; i++) {
  const t = i / SAMPLE_RATE;
  let env = 1;
  if (t < 5) env = t / 5;
  if (t > DURATION - 5) env = (DURATION - t) / 5;
  
  const shimmer = sine(t * noteToFreq(84)) * 0.003 + sine(t * noteToFreq(91)) * 0.002;
  buffer[i] += shimmer * env;
}

// Apply low-pass filter for warmth
const filtered = lowPassFilter(buffer, 4000, SAMPLE_RATE);

// Normalize
let maxAmp = 0;
for (let i = 0; i < filtered.length; i++) {
  maxAmp = Math.max(maxAmp, Math.abs(filtered[i]));
}
const normalizeGain = maxAmp > 0 ? 0.7 / maxAmp : 1;
for (let i = 0; i < filtered.length; i++) {
  filtered[i] *= normalizeGain;
}

// Write WAV file
function writeWav(filename, samples, sampleRate) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = samples.length * blockAlign;
  const fileSize = 36 + dataSize;
  
  const buf = Buffer.alloc(44 + dataSize);
  
  // RIFF header
  buf.write('RIFF', 0);
  buf.writeUInt32LE(fileSize, 4);
  buf.write('WAVE', 8);
  
  // fmt chunk
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);             // fmt chunk size (16 bytes)
  buf.writeUInt16LE(1, 20);              // audio format (1 = PCM)
  buf.writeUInt16LE(numChannels, 22);    // number of channels
  buf.writeUInt32LE(sampleRate, 24);     // sample rate
  buf.writeUInt32LE(byteRate, 28);       // byte rate
  buf.writeUInt16LE(blockAlign, 32);     // block align
  buf.writeUInt16LE(bitsPerSample, 34);  // bits per sample (16)
  
  // data chunk
  buf.write('data', 36);
  buf.writeUInt32LE(dataSize, 40);
  
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    const val = s < 0 ? s * 0x8000 : s * 0x7FFF;
    buf.writeInt16LE(Math.round(val), 44 + i * 2);
  }
  
  writeFileSync(filename, buf);
  console.log(`Written ${filename} (${(buf.length / 1024 / 1024).toFixed(1)} MB, ${DURATION}s)`);
}

const outputPath = path.join(__dirname, 'public', 'ambient-bg.wav');
writeWav(outputPath, filtered, SAMPLE_RATE);
