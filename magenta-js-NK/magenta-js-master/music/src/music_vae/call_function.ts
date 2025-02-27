/* This demo calls the functions from music_vae */

import {performance} from '../core/compat/global';

import * as mm from '../src/index';
import {sequences} from '../src/index';

import {DRUM_SEQS, MEL_A_QUARTERS, MEL_TEAPOT, MEL_TWINKLE} from './common';
import {writeNoteSeqs, writeTimer} from './common';

/* Now let's call the functions needed to run a sample melody for MusicVAE */

const inputs = [MEL_TEAPOT, MEL_TWINKLE];
writeNoteSeqs('new-inputs, inputs');

const mvae = new mm.MusicVAE(MEL_A_QUARTERS);
const sequence_vae = new sequences.MusicVae(DRUM_SEQS);
await mvae.initialize();
await sequence_vae.initialize();

let start = performance.now(); /* This starts the peformance of the melody, in this case a chord*/
const interp1 = await mvae.interpolate(inputs, 6, null, {chordProgression: ['A', 'B', 'C', 'B', 'A']});

const sample = await mvae.sample(5);
writeTimer('mel-sample-time', start);
writeNoteSeqs('mel-samples', sample);

let start2 = performance.now();
start2 = performance.now();
const interp2 = await mvae.interpolate(inputs, 3)
const sample2 = await mvae.sample(2);

let start3 = performance.now();
start3 = performance.now();
const interp3 = await mvae.interpolate(inputs, 4, null, {chords: ['A', 'A', 'B', 'C']});
const sample3 = await mvae.sample(4);

let start4 = performance.now()
start4 = performance.now()
const interp4 = await sequence_vae.interpolate(inputs, 3, null, {chords:['B', 'A', 'C']});
const sample4 = await sequence_vae(3);

writeTimer('mel-sample-time', start);
writeNoteSeqs('mel-samples', sample);

/** Thie demo shows the functions that are used in order to call the functions such as chordprogression, peformance and interpolate
but are also important in showing how the functions are actually run based on what I found in the github files.**/
