"use strict";
/**
 * Module containing functions for converting to and from quantized melodies.
 *
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
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
exports.MelodyRegister = exports.MelodyShape = exports.MelodyRhythm = exports.Melody = exports.NOTE_OFF = exports.NO_EVENT = void 0;
/**
 * Imports
 */
var tf = require("@tensorflow/tfjs");
var index_1 = require("../protobuf/index");
var sequences = require("./sequences");
exports.NO_EVENT = 0;
exports.NOTE_OFF = 1;
var FIRST_PITCH = 2;
/**
 * Melody representation as an array of integers: 0 for `NO_EVENT` (sustain), 1
 * for `NOTE_OFF`, and 2+ for note onsets at pitches between `minPitch` and
 * `maxPitch`.  Each position in the array corresponds to a fixed length of
 * time.  So, `[2, 4, 6, 7, 9, 11, 13, 14, 0, 0, 0, 1]` represents a major scale
 * where the final note is held for 4 time steps then released.
 *
 * @param events An array of melody events.
 * @param minPitch The minimum pitch to represent.
 * @param maxPitch The maximum pitch to represent.
 *
 */
var Melody = /** @class */ (function () {
    function Melody(events, minPitch, maxPitch) {
        this.events = events;
        this.minPitch = minPitch;
        this.maxPitch = maxPitch;
    }
    /**
     * Extract a melody from a `NoteSequence`.
     *
     * @param noteSequence `NoteSequence` from which to extract a melody.
     * @param minPitch The minimum pitch to represent. Those above this value will
     * cause an error to be thrown.
     * @param maxPitch The maximum pitch to represent. Those above this value will
     * cause an error to be thrown.
     * @param ignorePolyphony If false, an error will be raised when notes start
     * at the same step. If true, the highest pitched note is used and others are
     * ignored.
     * @param numSteps The length of each sequence.
     * @returns A `Melody` created from the `NoteSequence`.
     */
    Melody.fromNoteSequence = function (noteSequence, minPitch, maxPitch, ignorePolyphony, numSteps) {
        if (ignorePolyphony === void 0) { ignorePolyphony = true; }
        sequences.assertIsQuantizedSequence(noteSequence);
        // Sort by note start times, and secondarily by pitch descending.
        var sortedNotes = noteSequence.notes.sort(function (n1, n2) {
            if (n1.quantizedStartStep === n2.quantizedStartStep) {
                return n2.pitch - n1.pitch;
            }
            return n1.quantizedStartStep - n2.quantizedStartStep;
        });
        var events = new Int32Array(numSteps || noteSequence.totalQuantizedSteps);
        var lastStart = -1;
        sortedNotes.forEach(function (n) {
            if (n.quantizedStartStep === lastStart) {
                if (!ignorePolyphony) {
                    throw new Error('`NoteSequence` is not monophonic.');
                }
                else {
                    // Keep highest note.
                    // Notes are sorted by pitch descending, so if a note is already at
                    // this position its the highest pitch.
                    return;
                }
            }
            if (n.pitch < minPitch || n.pitch > maxPitch) {
                throw Error('`NoteSequence` has a pitch outside of the valid range: ' +
                    "".concat(n.pitch));
            }
            events[n.quantizedStartStep] = n.pitch - minPitch + FIRST_PITCH;
            events[n.quantizedEndStep] = exports.NOTE_OFF;
            lastStart = n.quantizedStartStep;
        });
        return new Melody(events, minPitch, maxPitch);
    };
    /**
     * Convert a melody to quantized NoteSequence.
     *
     * @param stepsPerQuarter Optional number of steps per quarter note.
     * @param qpm Optional number of quarter notes per minute.
     * @returns A quantized `NoteSequence` created from the `Melody`.
     */
    Melody.prototype.toNoteSequence = function (stepsPerQuarter, qpm) {
        var noteSequence = sequences.createQuantizedNoteSequence(stepsPerQuarter, qpm);
        var currNote = null;
        for (var s = 0; s < this.events.length; ++s) { // step
            var event_1 = this.events[s];
            switch (event_1) {
                case exports.NO_EVENT:
                    break;
                case exports.NOTE_OFF:
                    if (currNote) {
                        currNote.quantizedEndStep = s;
                        noteSequence.notes.push(currNote);
                        currNote = null;
                    }
                    break;
                default:
                    if (currNote) {
                        currNote.quantizedEndStep = s;
                        noteSequence.notes.push(currNote);
                    }
                    currNote = index_1.NoteSequence.Note.create({
                        pitch: event_1 - FIRST_PITCH + this.minPitch,
                        quantizedStartStep: s
                    });
            }
        }
        if (currNote) {
            currNote.quantizedEndStep = this.events.length;
            noteSequence.notes.push(currNote);
        }
        noteSequence.totalQuantizedSteps = this.events.length;
        return noteSequence;
    };
    return Melody;
}());
exports.Melody = Melody;
/**
 * Rhythm control signal. Extracts a depth-1 tensor indicating note onsets.
 */
var MelodyRhythm = /** @class */ (function () {
    function MelodyRhythm() {
        this.depth = 1;
    }
    /**
     * Extract the rhythm from a Melody object.
     *
     * @param melody Melody object from which to extract rhythm.
     * @returns An n-by-1 2D tensor containing the melody rhythm, with 1 in steps
     * with a note onset and 0 elsewhere.
     */
    MelodyRhythm.prototype.extract = function (melody) {
        var numSteps = melody.events.length;
        var buffer = tf.buffer([numSteps, 1]);
        for (var step = 0; step < numSteps; ++step) {
            buffer.set(melody.events[step] >= FIRST_PITCH ? 1 : 0, step, 0);
        }
        return buffer.toTensor().as2D(numSteps, 1);
    };
    return MelodyRhythm;
}());
exports.MelodyRhythm = MelodyRhythm;
/**
 * Melodic shape control signal. Extracts a depth-3 tensor representing a
 * melodic contour as a Parsons code, a sequence of {up, down, same} values
 * corresponding to the pitch interval direction. We use a one-hot encoding,
 * where 0 = down, 1 = same, and 2 = up.
 */
var MelodyShape = /** @class */ (function () {
    function MelodyShape() {
        this.depth = 3;
    }
    /**
     * Extract the melodic shape from a Melody object.
     *
     * @param melody Melody object from which to extract shape.
     * @returns An n-by-3 2D tensor containing the melodic shape as one-hot
     * Parsons code.
     */
    MelodyShape.prototype.extract = function (melody) {
        var numSteps = melody.events.length;
        var buffer = tf.buffer([numSteps, 3]);
        var lastIndex = null;
        var lastPitch = null;
        for (var step = 0; step < numSteps; ++step) {
            if (melody.events[step] >= FIRST_PITCH) {
                if (lastIndex !== null) {
                    if (buffer.get(lastIndex, 0) === 0 &&
                        buffer.get(lastIndex, 1) === 0 &&
                        buffer.get(lastIndex, 2) === 0) {
                        // This is the first time contour direction has been established, so
                        // propagate that direction back to the beginning of the melody.
                        lastIndex = -1;
                    }
                    var direction = void 0;
                    if (melody.events[step] < lastPitch) {
                        direction = 0; // down
                    }
                    else if (melody.events[step] > lastPitch) {
                        direction = 2; // up
                    }
                    else {
                        direction = 1; // flat
                    }
                    // Fill in a 'linear' contour.
                    for (var i = step; i > lastIndex; --i) {
                        buffer.set(1, i, direction);
                    }
                }
                lastIndex = step;
                lastPitch = melody.events[step];
            }
        }
        // Handle the final contour segment.
        if (lastIndex !== numSteps - 1) {
            if ((lastIndex === null) ||
                (buffer.get(lastIndex, 0) === 0 && buffer.get(lastIndex, 1) === 0 &&
                    buffer.get(lastIndex, 2) === 0)) {
                // There were zero or one notes, make this a flat contour.
                for (var i = 0; i < numSteps; ++i) {
                    buffer.set(1, i, 1);
                }
            }
            else {
                // Just continue whatever the final contour direction was.
                for (var i = numSteps - 1; i > lastIndex; --i) {
                    for (var j = 0; j < 3; j++) {
                        buffer.set(buffer.get(lastIndex, j), i, j);
                    }
                }
            }
        }
        return buffer.toTensor().as2D(numSteps, 3);
    };
    return MelodyShape;
}());
exports.MelodyShape = MelodyShape;
/**
 * Register control signal. Extracts a tensor with one-hot register indicator,
 * constant across time steps.
 */
var MelodyRegister = /** @class */ (function () {
    function MelodyRegister(boundaryPitches) {
        this.boundaryPitches = boundaryPitches;
        this.depth = boundaryPitches.length + 1;
    }
    MelodyRegister.prototype.meanMelodyPitch = function (melody) {
        // Compute mean melody pitch, weighted by number of time steps the pitch is
        // held.
        var total = 0;
        var count = 0;
        var currentPitch = null;
        for (var step = 0; step < melody.events.length; ++step) {
            if (melody.events[step] === exports.NOTE_OFF) {
                currentPitch = null;
            }
            else if (melody.events[step] >= FIRST_PITCH) {
                currentPitch = melody.minPitch + melody.events[step] - FIRST_PITCH;
            }
            if (currentPitch !== null) {
                total += currentPitch;
                count += 1;
            }
        }
        if (count) {
            return total / count;
        }
        else {
            return null;
        }
    };
    /**
     * Extract the register from a Melody object.
     *
     * @param melody Melody object from which to extract register.
     * @returns An n-by-`depth` 2D tensor containing the one-hot encoded melody
     * register, constant across time steps.
     */
    MelodyRegister.prototype.extract = function (melody) {
        var numSteps = melody.events.length;
        var meanPitch = this.meanMelodyPitch(melody);
        if (meanPitch === null) {
            return tf.zeros([numSteps, this.depth]);
        }
        var bin = 0;
        while (bin < this.boundaryPitches.length &&
            meanPitch >= this.boundaryPitches[bin]) {
            bin++;
        }
        var buffer = tf.buffer([numSteps, this.depth]);
        for (var step = 0; step < numSteps; ++step) {
            buffer.set(1, step, bin);
        }
        return buffer.toTensor().as2D(numSteps, this.depth);
    };
    return MelodyRegister;
}());
exports.MelodyRegister = MelodyRegister;
