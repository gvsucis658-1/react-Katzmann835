"use strict";
/**
 * Global constants.
 *
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HI_CLICK_CLASS = exports.LO_CLICK_CLASS = exports.HI_CLICK_PITCH = exports.LO_CLICK_PITCH = exports.MAX_MIDI_PROGRAM = exports.MIN_MIDI_PROGRAM = exports.MAX_DRUM_PITCH = exports.MIN_DRUM_PITCH = exports.MAX_PIANO_PITCH = exports.MIN_PIANO_PITCH = exports.MIDI_PITCHES = exports.MAX_MIDI_PITCH = exports.MIN_MIDI_PITCH = exports.NUM_PITCH_CLASSES = exports.NO_CHORD = exports.MIDI_VELOCITIES = exports.MAX_MIDI_VELOCITY = exports.MIN_MIDI_VELOCITY = exports.DEFAULT_DRUM_PITCH_CLASSES = exports.NON_DRUM_CHANNELS = exports.DRUM_CHANNEL = exports.DEFAULT_CHANNEL = exports.DEFAULT_TICKS_PER_QUARTER = exports.DEFAULT_PROGRAM = exports.DEFAULT_VELOCITY = exports.DEFAULT_STEPS_PER_SECOND = exports.DEFAULT_STEPS_PER_QUARTER = exports.DEFAULT_STEPS_PER_BAR = exports.DEFAULT_QUARTERS_PER_MINUTE = void 0;
/**
 * Null comment for documentation generation.
 */
null; // tslint:disable-line:no-unused-expression
exports.DEFAULT_QUARTERS_PER_MINUTE = 120.0;
// 4/4 music sampled at 4 steps per quarter note.
exports.DEFAULT_STEPS_PER_BAR = 16;
exports.DEFAULT_STEPS_PER_QUARTER = 4;
// Default absolute quantization.
exports.DEFAULT_STEPS_PER_SECOND = 100;
exports.DEFAULT_VELOCITY = 80;
exports.DEFAULT_PROGRAM = 0;
exports.DEFAULT_TICKS_PER_QUARTER = 220;
exports.DEFAULT_CHANNEL = 0;
exports.DRUM_CHANNEL = 9;
exports.NON_DRUM_CHANNELS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15];
exports.DEFAULT_DRUM_PITCH_CLASSES = [
    // bass drum
    [36, 35],
    // snare drum
    [38, 27, 28, 31, 32, 33, 34, 37, 39, 40, 56, 65, 66, 75, 85],
    // closed hi-hat
    [42, 44, 54, 68, 69, 70, 71, 73, 78, 80],
    // open hi-hat
    [46, 67, 72, 74, 79, 81],
    // low tom
    [45, 29, 41, 61, 64, 84],
    // mid tom
    [48, 47, 60, 63, 77, 86, 87],
    // high tom
    [50, 30, 43, 62, 76, 83],
    // crash cymbal
    [49, 55, 57, 58],
    // ride cymbal
    [51, 52, 53, 59, 82]
];
// Velocity-related constants.
exports.MIN_MIDI_VELOCITY = 0;
exports.MAX_MIDI_VELOCITY = 127;
exports.MIDI_VELOCITIES = exports.MAX_MIDI_VELOCITY - exports.MIN_MIDI_VELOCITY + 1;
// Pitch-related constants.
exports.NO_CHORD = 'N.C.';
exports.NUM_PITCH_CLASSES = 12;
exports.MIN_MIDI_PITCH = 0;
exports.MAX_MIDI_PITCH = 127;
exports.MIDI_PITCHES = exports.MAX_MIDI_PITCH - exports.MIN_MIDI_PITCH + 1;
exports.MIN_PIANO_PITCH = 21;
exports.MAX_PIANO_PITCH = 108;
exports.MIN_DRUM_PITCH = 35;
exports.MAX_DRUM_PITCH = 81;
// Program-related constants.
exports.MIN_MIDI_PROGRAM = 0;
exports.MAX_MIDI_PROGRAM = 127;
// Click-track constants.
exports.LO_CLICK_PITCH = 89;
exports.HI_CLICK_PITCH = 90;
exports.LO_CLICK_CLASS = 9;
exports.HI_CLICK_CLASS = 10;
