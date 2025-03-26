"use strict";
/**
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
exports.Performance = void 0;
/**
 * Imports
 */
var index_1 = require("../protobuf/index");
var constants = require("./constants");
var sequences = require("./sequences");
var logging = require("./logging");
/**
 * Performance representation with variable step size, consisting of a sequence
 * of `NoteOn`, `NoteOff`, `TimeShift`, and `VelocityChange` events.
 *
 * @param events An array of performance events.
 * @param maxShiftSteps Number of steps in the maximum time shift.
 * @param numVelocityBins The number of quantized MIDI velocity bins to use.
 * If zero, velocities will be ignored.
 * @param program (Optional) The MIDI program to use for these events.
 * @param isDrum (Optional) Whether or not these are drum events.
 */
var Performance = /** @class */ (function () {
    function Performance(events, maxShiftSteps, numVelocityBins, program, isDrum) {
        this.events = events;
        this.maxShiftSteps = maxShiftSteps;
        this.numVelocityBins = numVelocityBins;
        this.program = program;
        this.isDrum = isDrum;
    }
    /**
     * Extract a performance from a `NoteSequence`.
     *
     * @param noteSequence `NoteSequence` from which to extract a performance.
     * @param maxShiftSteps Number of steps in maximum time shift.
     * @param numVelocityBins Number of velocity bins to use. If zero, ignore note
     * velocities.
     * @param instrument (Optional) Instrument to extract. If not specified,
     * extract all instruments.
     * @returns A `Performance` created from the `NoteSequence`.
     */
    Performance.fromNoteSequence = function (noteSequence, maxShiftSteps, numVelocityBins, instrument) {
        sequences.assertIsQuantizedSequence(noteSequence);
        // First extract all desired notes and sort by increasing start time and
        // (secondarily) pitch.
        var notes = noteSequence.notes.filter(function (note, _) {
            return instrument !== undefined ? note.instrument === instrument : true;
        });
        var sortedNotes = notes.sort(function (a, b) { return a.startTime === b.startTime ? a.pitch - b.pitch :
            a.startTime - b.startTime; });
        // Now sort all note start and end events by quantized time step and
        // position of the note in the above list.
        var onsets = sortedNotes.map(function (note, i) { return ({ step: note.quantizedStartStep, index: i, isOffset: 0 }); });
        var offsets = sortedNotes.map(function (note, i) { return ({ step: note.quantizedEndStep, index: i, isOffset: 1 }); });
        var noteEvents = onsets.concat(offsets).sort(function (a, b) { return a.step === b.step ?
            (a.index === b.index ? a.isOffset - b.isOffset :
                a.index - b.index) :
            a.step - b.step; });
        var velocityBinSize = numVelocityBins ?
            Math.ceil((constants.MIDI_VELOCITIES - 1) / numVelocityBins) :
            undefined;
        var events = [];
        var currentStep = 0;
        var currentVelocityBin = numVelocityBins;
        for (var _i = 0, noteEvents_1 = noteEvents; _i < noteEvents_1.length; _i++) {
            var e = noteEvents_1[_i];
            if (e.step > currentStep) {
                // The next note event requires a time shift.
                while (e.step > currentStep + maxShiftSteps) {
                    events.push({ type: 'time-shift', steps: maxShiftSteps });
                    currentStep += maxShiftSteps;
                }
                events.push({ type: 'time-shift', steps: e.step - currentStep });
                currentStep = e.step;
            }
            if (e.isOffset) {
                // Turn off the note.
                events.push({ type: 'note-off', pitch: sortedNotes[e.index].pitch });
            }
            else {
                // Before we turn on the note, we may need to change the current
                // velocity bin.
                if (velocityBinSize) {
                    var velocityBin = Math.floor((sortedNotes[e.index].velocity -
                        constants.MIN_MIDI_VELOCITY - 1) /
                        velocityBinSize) +
                        1;
                    if (velocityBin !== currentVelocityBin) {
                        events.push({ type: 'velocity-change', velocityBin: velocityBin });
                        currentVelocityBin = velocityBin;
                    }
                }
                // Now turn on the note.
                events.push({ type: 'note-on', pitch: sortedNotes[e.index].pitch });
            }
        }
        // Determine the drum status, if consistent.
        var isDrum = notes.some(function (note) { return note.isDrum; }) ?
            (notes.some(function (note) { return !note.isDrum; }) ? undefined : true) :
            false;
        // Determine the program used, if consistent.
        var programs = Array.from(new Set(notes.map(function (note) { return note.program; })));
        var program = (!isDrum && programs.length === 1) ? programs[0] : undefined;
        var performance = new Performance(events, maxShiftSteps, numVelocityBins, program, isDrum);
        // Make sure the performance has the correct number of steps.
        performance.setNumSteps(noteSequence.totalQuantizedSteps);
        return performance;
    };
    /**
     * Return the total number of time steps in the performance.
     *
     * @returns The total number of steps.
     */
    Performance.prototype.getNumSteps = function () {
        return this.events.filter(function (event) { return event.type === 'time-shift'; })
            .map(function (event) { return event.steps; })
            .reduce(function (a, b) { return a + b; }, 0);
    };
    /**
     * Set the total number of time steps in the performance by either adding
     * time-shift events to the end or truncating.
     *
     * @param The desired number of time steps.
     */
    Performance.prototype.setNumSteps = function (numSteps) {
        var currentNumSteps = this.getNumSteps();
        if (currentNumSteps < numSteps) {
            // Add time shift events to the end of the performance.
            if (this.events.length) {
                var event_1 = this.events[this.events.length - 1];
                if (event_1.type === 'time-shift') {
                    var steps = Math.min(numSteps - currentNumSteps, this.maxShiftSteps - event_1.steps);
                    event_1.steps += steps;
                    currentNumSteps += steps;
                }
            }
            while (currentNumSteps < numSteps) {
                if (currentNumSteps + this.maxShiftSteps > numSteps) {
                    this.events.push({ type: 'time-shift', steps: numSteps - currentNumSteps });
                    currentNumSteps = numSteps;
                }
                else {
                    this.events.push({ type: 'time-shift', steps: this.maxShiftSteps });
                    currentNumSteps += this.maxShiftSteps;
                }
            }
        }
        else if (currentNumSteps > numSteps) {
            // Drop events from the end of the performance.
            while (this.events.length && currentNumSteps > numSteps) {
                var event_2 = this.events[this.events.length - 1];
                if (event_2.type === 'time-shift') {
                    if (currentNumSteps - event_2.steps < numSteps) {
                        event_2.steps -= currentNumSteps - numSteps;
                        currentNumSteps = numSteps;
                    }
                    else {
                        this.events.pop();
                        currentNumSteps -= event_2.steps;
                    }
                }
                else {
                    this.events.pop();
                }
            }
        }
    };
    /**
     * Convert this performance representation to `NoteSequence`.
     *
     * @param instrument Instrument value to give each note.
     * @returns A `NoteSequence` corresponding to these performance events.
     */
    Performance.prototype.toNoteSequence = function (instrument) {
        var _this = this;
        var velocityBinSize = this.numVelocityBins ?
            Math.ceil((constants.MIDI_VELOCITIES - 1) / this.numVelocityBins) :
            undefined;
        var noteSequence = index_1.NoteSequence.create();
        var currentStep = 0;
        var currentVelocity = undefined;
        // Initialize a map from pitch to (the start step and velocity of) all
        // active notes at that pitch. Multiple notes can be active at the same
        // pitch.
        var pitchStartStepsAndVelocities = new Map();
        for (var i = constants.MIN_MIDI_PITCH; i <= constants.MAX_MIDI_PITCH; ++i) {
            pitchStartStepsAndVelocities.set(i, []);
        }
        for (var _i = 0, _a = this.events; _i < _a.length; _i++) {
            var event_3 = _a[_i];
            switch (event_3.type) {
                case 'note-on':
                    // Start a new note.
                    pitchStartStepsAndVelocities.get(event_3.pitch).push([
                        currentStep, currentVelocity
                    ]);
                    break;
                case 'note-off':
                    // End an active note.
                    var startStepsAndVelocities = pitchStartStepsAndVelocities.get(event_3.pitch);
                    if (startStepsAndVelocities.length) {
                        var _b = startStepsAndVelocities.shift(), startStep = _b[0], velocity = _b[1];
                        if (currentStep > startStep) {
                            noteSequence.notes.push(index_1.NoteSequence.Note.create({
                                pitch: event_3.pitch,
                                velocity: velocity,
                                instrument: instrument,
                                quantizedStartStep: startStep,
                                quantizedEndStep: currentStep,
                                program: this.program,
                                isDrum: this.isDrum,
                            }));
                        }
                        else {
                            logging.log('Ignoring zero-length note: ' +
                                "(pitch = ".concat(event_3.pitch, ", step = ").concat(currentStep, ")"), 'Performance');
                        }
                    }
                    else {
                        logging.log('Ignoring note-off with no previous note-on:' +
                            "(pitch = ".concat(event_3.pitch, ", step = ").concat(currentStep, ")"), 'Performance');
                    }
                    break;
                case 'time-shift':
                    // Shift time forward.
                    currentStep += event_3.steps;
                    break;
                case 'velocity-change':
                    // Change current velocity.
                    if (velocityBinSize) {
                        currentVelocity = constants.MIN_MIDI_VELOCITY +
                            (event_3.velocityBin - 1) * velocityBinSize + 1;
                    }
                    else {
                        throw new Error("Unexpected velocity change event: ".concat(event_3));
                    }
                    break;
                default:
                    throw new Error("Unrecognized performance event: ".concat(event_3));
            }
        }
        // There could be remaining pitches that were never ended. End them now
        // and create notes.
        pitchStartStepsAndVelocities.forEach(function (startStepsAndVelocities, pitch) {
            for (var _i = 0, startStepsAndVelocities_1 = startStepsAndVelocities; _i < startStepsAndVelocities_1.length; _i++) {
                var _a = startStepsAndVelocities_1[_i], startStep = _a[0], velocity = _a[1];
                if (currentStep > startStep) {
                    noteSequence.notes.push(index_1.NoteSequence.Note.create({
                        pitch: pitch,
                        velocity: velocity,
                        instrument: instrument,
                        quantizedStartStep: startStep,
                        quantizedEndStep: currentStep,
                        program: _this.program,
                        isDrum: _this.isDrum
                    }));
                }
                else {
                    logging.log('Ignoring zero-length note: ' +
                        "(pitch = ".concat(pitch, ", step = ").concat(currentStep, ")"), 'Performance');
                }
            }
        });
        // Set the total number of steps.
        noteSequence.totalQuantizedSteps = currentStep;
        return noteSequence;
    };
    return Performance;
}());
exports.Performance = Performance;
