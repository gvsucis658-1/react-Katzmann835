"use strict";
/**
 * A library for common manipulations of `NoteSequence`s.
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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuantizationStatusException = exports.MultipleTempoException = exports.NegativeTimeException = exports.BadTimeSignatureException = exports.MultipleTimeSignatureException = void 0;
exports.clone = clone;
exports.stepsPerQuarterToStepsPerSecond = stepsPerQuarterToStepsPerSecond;
exports.quantizeToStep = quantizeToStep;
exports.quantizeNoteSequence = quantizeNoteSequence;
exports.isQuantizedSequence = isQuantizedSequence;
exports.assertIsQuantizedSequence = assertIsQuantizedSequence;
exports.isRelativeQuantizedSequence = isRelativeQuantizedSequence;
exports.assertIsRelativeQuantizedSequence = assertIsRelativeQuantizedSequence;
exports.isAbsoluteQuantizedSequence = isAbsoluteQuantizedSequence;
exports.assertIsAbsoluteQuantizedSequence = assertIsAbsoluteQuantizedSequence;
exports.unquantizeSequence = unquantizeSequence;
exports.createQuantizedNoteSequence = createQuantizedNoteSequence;
exports.mergeInstruments = mergeInstruments;
exports.replaceInstruments = replaceInstruments;
exports.mergeConsecutiveNotes = mergeConsecutiveNotes;
exports.applySustainControlChanges = applySustainControlChanges;
exports.concatenate = concatenate;
exports.trim = trim;
exports.split = split;
/**
 * Imports
 */
var index_1 = require("../protobuf/index");
var constants = require("./constants");
// Set the quantization cutoff.
// Note events before this cutoff are rounded down to nearest step. Notes
// above this cutoff are rounded up to nearest step. The cutoff is given as a
// fraction of a step.
// For example, with quantize_cutoff = 0.75 using 0-based indexing,
// if .75 < event <= 1.75, it will be quantized to step 1.
// If 1.75 < event <= 2.75 it will be quantized to step 2.
// A number close to 1.0 gives less wiggle room for notes that start early,
// and they will be snapped to the previous step.
var QUANTIZE_CUTOFF = 0.5;
var MultipleTimeSignatureException = /** @class */ (function (_super) {
    __extends(MultipleTimeSignatureException, _super);
    function MultipleTimeSignatureException(message) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, _newTarget.prototype);
        return _this;
    }
    return MultipleTimeSignatureException;
}(Error));
exports.MultipleTimeSignatureException = MultipleTimeSignatureException;
var BadTimeSignatureException = /** @class */ (function (_super) {
    __extends(BadTimeSignatureException, _super);
    function BadTimeSignatureException(message) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, _newTarget.prototype);
        return _this;
    }
    return BadTimeSignatureException;
}(Error));
exports.BadTimeSignatureException = BadTimeSignatureException;
var NegativeTimeException = /** @class */ (function (_super) {
    __extends(NegativeTimeException, _super);
    function NegativeTimeException(message) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, _newTarget.prototype);
        return _this;
    }
    return NegativeTimeException;
}(Error));
exports.NegativeTimeException = NegativeTimeException;
var MultipleTempoException = /** @class */ (function (_super) {
    __extends(MultipleTempoException, _super);
    function MultipleTempoException(message) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, _newTarget.prototype);
        return _this;
    }
    return MultipleTempoException;
}(Error));
exports.MultipleTempoException = MultipleTempoException;
/**
 * Exception for when a sequence was unexpectedly quantized or unquantized.
 *
 * Should not happen during normal operation and likely indicates a programming
 * error.
 */
var QuantizationStatusException = /** @class */ (function (_super) {
    __extends(QuantizationStatusException, _super);
    function QuantizationStatusException(message) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, _newTarget.prototype);
        return _this;
    }
    return QuantizationStatusException;
}(Error));
exports.QuantizationStatusException = QuantizationStatusException;
function isPowerOf2(n) {
    return n && (n & (n - 1)) === 0;
}
function clone(ns) {
    return index_1.NoteSequence.decode(index_1.NoteSequence.encode(ns).finish());
}
/**
 * Calculates steps per second given stepsPerQuarter and a QPM.
 */
function stepsPerQuarterToStepsPerSecond(stepsPerQuarter, qpm) {
    return stepsPerQuarter * qpm / 60.0;
}
/**
 * Quantizes seconds to the nearest step, given steps_per_second.
 * See the comments above `QUANTIZE_CUTOFF` for details on how the
 * quantizing algorithm works.
 * @param unquantizedSeconds Seconds to quantize.
 * @param stepsPerSecond Quantizing resolution.
 * @param quantizeCutoff Value to use for quantizing cutoff.
 * @returns the quantized step.
 */
function quantizeToStep(unquantizedSeconds, stepsPerSecond, quantizeCutoff) {
    if (quantizeCutoff === void 0) { quantizeCutoff = QUANTIZE_CUTOFF; }
    var unquantizedSteps = unquantizedSeconds * stepsPerSecond;
    return Math.floor(unquantizedSteps + (1 - quantizeCutoff));
}
/**
 * Returns a list of events with a `time` and `quantizedStep` properties.
 */
function getQuantizedTimeEvents(ns) {
    return ns.controlChanges.concat(ns.textAnnotations);
}
/**
 * Quantize the notes and events of a NoteSequence proto in place.
 * Note start and end times, and chord times are snapped to a nearby
 * quantized step, and the resulting times are stored in a separate field
 * (e.g. QuantizedStartStep). See the comments above `QUANTIZE_CUTOFF` for
 * details on how the quantizing algorithm works.
 * @param ns A `NoteSequence` to quantize. Will be modified in place.
 * @param stepsPerSecond Each second will be divided into this many
 * quantized time steps.
 */
function quantizeNotesAndEvents(ns, stepsPerSecond) {
    for (var _i = 0, _a = ns.notes; _i < _a.length; _i++) {
        var note = _a[_i];
        // Quantize the start and end times of the note.
        note.quantizedStartStep = quantizeToStep(note.startTime, stepsPerSecond);
        note.quantizedEndStep = quantizeToStep(note.endTime, stepsPerSecond);
        if (note.quantizedEndStep === note.quantizedStartStep) {
            note.quantizedEndStep += 1;
        }
        // Do not allow notes to start or end in negative time.
        if (note.quantizedStartStep < 0 || note.quantizedEndStep < 0) {
            throw new NegativeTimeException("Got negative note time: start_step = " +
                "".concat(note.quantizedStartStep, ", end_step = ") +
                "".concat(note.quantizedEndStep));
        }
        // Extend quantized sequence if necessary.
        if (note.quantizedEndStep > ns.totalQuantizedSteps) {
            ns.totalQuantizedSteps = note.quantizedEndStep;
        }
    }
    // Also quantize control changes and text annotations.
    getQuantizedTimeEvents(ns).forEach(function (event) {
        // Quantize the event time, disallowing negative time.
        event.quantizedStep = quantizeToStep(event.time, stepsPerSecond);
        if (event.quantizedStep < 0) {
            throw new NegativeTimeException("Got negative event time: step = ".concat(event.quantizedStep));
        }
    });
}
/**
 * Confirms there is no tempo change.
 */
function assertSingleTempo(ns) {
    if (!ns.tempos || ns.tempos.length === 0) {
        // There is a single (implicit) tempo.
        return;
    }
    ns.tempos.sort(function (a, b) { return a.time - b.time; });
    // There is an implicit 120.0 qpm tempo at 0 time. So if the first tempo
    // is something other that 120.0 and it's at a time other than 0, that's
    // an implicit tempo change.
    if (ns.tempos[0].time !== 0 &&
        ns.tempos[0].qpm !== constants.DEFAULT_QUARTERS_PER_MINUTE) {
        throw new MultipleTempoException('NoteSequence has an implicit tempo change from initial ' +
            "".concat(constants.DEFAULT_QUARTERS_PER_MINUTE, " qpm to ") +
            "".concat(ns.tempos[0].qpm, " qpm at ").concat(ns.tempos[0].time, " seconds."));
    }
    for (var i = 1; i < ns.tempos.length; i++) {
        if (ns.tempos[i].qpm !== ns.tempos[0].qpm) {
            throw new MultipleTempoException('NoteSequence has at least one tempo change from ' +
                "".concat(ns.tempos[0].qpm, " qpm to ").concat(ns.tempos[i].qpm) +
                "qpm at ".concat(ns.tempos[i].time, " seconds."));
        }
    }
}
/**
 * Quantize a NoteSequence proto relative to tempo.
 *
 * The input NoteSequence is copied and quantization-related fields are
 * populated. Sets the `steps_per_quarter` field in the `quantization_info`
 * message in the NoteSequence.
 *
 * Note start and end times, and chord times are snapped to a nearby quantized
 * step, and the resulting times are stored in a separate field (e.g.,
 * QuantizedStartStep). See the comments above `QUANTIZE_CUTOFF` for details
 * on how the quantizing algorithm works.
 *
 * @param ns The `NoteSequence` to quantize.
 * @param stepsPerQuarter Each quarter note of music will be divided into
 *    this many quantized time steps.
 * @returns A copy of the original NoteSequence, with quantized times added.
 *
 * @throws {MultipleTempoException} If there is a change in tempo in
 * the sequence.
 * @throws {MultipleTimeSignatureException} If there is a change in time
 * signature in the sequence.
 * @throws {BadTimeSignatureException} If the time signature found in
 * the sequence has a 0 numerator or a denominator which is not a power of 2.
 * @throws {NegativeTimeException} If a note or chord occurs at a negative
 * time.
 */
function quantizeNoteSequence(ns, stepsPerQuarter) {
    // Make a copy.
    var qns = clone(ns);
    qns.quantizationInfo =
        index_1.NoteSequence.QuantizationInfo.create({ stepsPerQuarter: stepsPerQuarter });
    if (qns.timeSignatures.length > 0) {
        qns.timeSignatures.sort(function (a, b) { return a.time - b.time; });
        // There is an implicit 4/4 time signature at 0 time. So if the first time
        // signature is something other than 4/4 and it's at a time other than 0,
        // that's an implicit time signature change.
        if (qns.timeSignatures[0].time !== 0 &&
            !(qns.timeSignatures[0].numerator === 4 &&
                qns.timeSignatures[0].denominator === 4)) {
            throw new MultipleTimeSignatureException('NoteSequence has an implicit change from initial 4/4 time ' +
                "signature to ".concat(qns.timeSignatures[0].numerator, "/") +
                "".concat(qns.timeSignatures[0].denominator, " at ") +
                "".concat(qns.timeSignatures[0].time, " seconds."));
        }
        for (var i = 1; i < qns.timeSignatures.length; i++) {
            var timeSignature = qns.timeSignatures[i];
            if (timeSignature.numerator !== qns.timeSignatures[0].numerator ||
                timeSignature.denominator !== qns.timeSignatures[0].denominator) {
                throw new MultipleTimeSignatureException('NoteSequence has at least one time signature change from ' +
                    "".concat(qns.timeSignatures[0].numerator, "/") +
                    "".concat(qns.timeSignatures[0].denominator, " to ") +
                    "".concat(timeSignature.numerator, "/").concat(timeSignature.denominator, " ") +
                    "at ".concat(timeSignature.time, " seconds"));
            }
        }
        // Make it clear that there is only 1 time signature and it starts at the
        // beginning.
        qns.timeSignatures[0].time = 0;
        qns.timeSignatures = [qns.timeSignatures[0]];
    }
    else {
        var timeSignature = index_1.NoteSequence.TimeSignature.create({ numerator: 4, denominator: 4, time: 0 });
        qns.timeSignatures.push(timeSignature);
    }
    var firstTS = qns.timeSignatures[0];
    if (!isPowerOf2(firstTS.denominator)) {
        throw new BadTimeSignatureException('Denominator is not a power of 2. Time signature: ' +
            "".concat(firstTS.numerator, "/").concat(firstTS.denominator));
    }
    if (firstTS.numerator === 0) {
        throw new BadTimeSignatureException('Numerator is 0. Time signature: ' +
            "".concat(firstTS.numerator, "/").concat(firstTS.denominator));
    }
    if (qns.tempos.length > 0) {
        assertSingleTempo(qns);
        // Make it clear that there is only 1 tempo and it starts at the beginning
        qns.tempos[0].time = 0;
        qns.tempos = [qns.tempos[0]];
    }
    else {
        var tempo = index_1.NoteSequence.Tempo.create({ qpm: constants.DEFAULT_QUARTERS_PER_MINUTE, time: 0 });
        qns.tempos.push(tempo);
    }
    // Compute quantization steps per second.
    var stepsPerSecond = stepsPerQuarterToStepsPerSecond(stepsPerQuarter, qns.tempos[0].qpm);
    qns.totalQuantizedSteps = quantizeToStep(ns.totalTime, stepsPerSecond);
    quantizeNotesAndEvents(qns, stepsPerSecond);
    // return qns
    return qns;
}
/**
 * Returns whether or not a NoteSequence proto has been quantized.
 */
function isQuantizedSequence(ns) {
    return ns.quantizationInfo &&
        (ns.quantizationInfo.stepsPerQuarter > 0 ||
            ns.quantizationInfo.stepsPerSecond > 0);
}
/**
 * Confirms that the given NoteSequence has been quantized.
 */
function assertIsQuantizedSequence(ns) {
    if (!isQuantizedSequence(ns)) {
        throw new QuantizationStatusException("NoteSequence ".concat(ns.id, " is not quantized (missing quantizationInfo)"));
    }
}
/**
 * Returns whether the given NoteSequence has been quantized relative to tempo.
 */
function isRelativeQuantizedSequence(ns) {
    return ns.quantizationInfo && ns.quantizationInfo.stepsPerQuarter > 0;
}
/**
 * Confirms that the given NoteSequence has been quantized relative to tempo.
 */
function assertIsRelativeQuantizedSequence(ns) {
    if (!isRelativeQuantizedSequence(ns)) {
        throw new QuantizationStatusException("NoteSequence ".concat(ns.id, " is not quantized or is quantized based on absolute timing"));
    }
}
/**
 * Returns whether the given NoteSequence has been quantized by absolute time.
 */
function isAbsoluteQuantizedSequence(ns) {
    return ns.quantizationInfo && ns.quantizationInfo.stepsPerSecond > 0;
}
/**
 * Confirms that the given NoteSequence has been quantized by absolute time.
 */
function assertIsAbsoluteQuantizedSequence(ns) {
    if (!isAbsoluteQuantizedSequence(ns)) {
        throw new QuantizationStatusException("NoteSequence ".concat(ns.id, " is not quantized or is quantized based on relative timing"));
    }
}
/**
 * Create an unquantized version of a quantized `NoteSequence`.
 *
 * Any existing times will be replaced in the output `NoteSequence` and
 * quantization info and steps will be removed.
 *
 * @param ns The `NoteSequence` to unquantize.
 * @param qpm The tempo to use. If not provided, the tempo in `ns` is used,
 * or the default of 120 if it is not specified in the sequence either.
 * @returns a new non-quantized `NoteSequence` with time in seconds.
 */
function unquantizeSequence(qns, qpm) {
    // TODO(adarob): Support absolute quantized times and multiple tempos.
    assertIsRelativeQuantizedSequence(qns);
    assertSingleTempo(qns);
    var ns = clone(qns);
    if (qpm) {
        if (ns.tempos && ns.tempos.length > 0) {
            ns.tempos[0].qpm = qpm;
        }
        else {
            ns.tempos.push(index_1.NoteSequence.Tempo.create({ time: 0, qpm: qpm }));
        }
    }
    else {
        qpm = (qns.tempos && qns.tempos.length > 0) ?
            ns.tempos[0].qpm :
            constants.DEFAULT_QUARTERS_PER_MINUTE;
    }
    var stepToSeconds = function (step) {
        return step / ns.quantizationInfo.stepsPerQuarter * (60 / qpm);
    };
    ns.totalTime = stepToSeconds(ns.totalQuantizedSteps);
    ns.notes.forEach(function (n) {
        // Quantize the start and end times of the note.
        n.startTime = stepToSeconds(n.quantizedStartStep);
        n.endTime = stepToSeconds(n.quantizedEndStep);
        // Extend sequence if necessary.
        ns.totalTime = Math.max(ns.totalTime, n.endTime);
        // Delete the quantized step information.
        delete n.quantizedStartStep;
        delete n.quantizedEndStep;
    });
    // Also quantize control changes and text annotations.
    getQuantizedTimeEvents(ns).forEach(function (event) {
        // Quantize the event time, disallowing negative time.
        event.time = stepToSeconds(event.time);
    });
    delete ns.totalQuantizedSteps;
    delete ns.quantizationInfo;
    return ns;
}
/**
 * Create an empty quantized NoteSequence with steps per quarter note and tempo.
 * @param stepsPerQuarter The number of steps per quarter note to use.
 * @param qpm The tempo to use.
 * @returns A new quantized NoteSequence.
 */
function createQuantizedNoteSequence(stepsPerQuarter, qpm) {
    if (stepsPerQuarter === void 0) { stepsPerQuarter = constants.DEFAULT_STEPS_PER_QUARTER; }
    if (qpm === void 0) { qpm = constants.DEFAULT_QUARTERS_PER_MINUTE; }
    return index_1.NoteSequence.create({ quantizationInfo: { stepsPerQuarter: stepsPerQuarter }, tempos: [{ qpm: qpm }] });
}
/**
 * Assign instruments to the notes, pitch bends, and control changes of a
 * `NoteSequence` based on program numbers and drum status. All drums will be
 * assigned the last instrument (and program 0). All non-drum events with the
 * same program number will be assigned to a single instrument.
 * @param ns The `NoteSequence` for which to merge instruments. Will not be
 * modified.
 * @returns A copy of `ns` with merged instruments.
 */
function mergeInstruments(ns) {
    var result = clone(ns);
    var events = result.notes.concat(result.pitchBends).concat(result.controlChanges);
    var programs = Array.from(new Set(events.filter(function (e) { return !e.isDrum; }).map(function (e) { return e.program; })));
    events.forEach(function (e) {
        if (e.isDrum) {
            e.program = 0;
            e.instrument = programs.length;
        }
        else {
            e.instrument = programs.indexOf(e.program);
        }
    });
    return result;
}
/**
 * Replaces all the notes in an input sequence that match the instruments in
 * a second sequence. For example, if `replaceSequence` has notes that all have
 * either `instrument=0` or `instrument=1`, then any notes in `originalSequence`
 * with instruments 0 or 1 will be removed and replaced with the notes in
 * `replaceSequence`. If there are instruments in `replaceSequence` that are
 * *not* in `originalSequence`, they will not be added.
 * @param originalSequence The `NoteSequence` to be changed.
 * @param replaceSequence The `NoteSequence` that will replace the notes in
 * `sequence` with the same instrument.
 * @return a new `NoteSequence` with the instruments replaced.
 */
function replaceInstruments(originalSequence, replaceSequence) {
    var instrumentsInOriginal = new Set(originalSequence.notes.map(function (n) { return n.instrument; }));
    var instrumentsInReplace = new Set(replaceSequence.notes.map(function (n) { return n.instrument; }));
    var newNotes = [];
    // Go through the original sequence, and only keep the notes for instruments
    // *not* in the second sequence.
    originalSequence.notes.forEach(function (n) {
        if (!instrumentsInReplace.has(n.instrument)) {
            newNotes.push(index_1.NoteSequence.Note.create(n));
        }
    });
    // Go through the second sequence and add all the notes for instruments in the
    // first sequence.
    replaceSequence.notes.forEach(function (n) {
        if (instrumentsInOriginal.has(n.instrument)) {
            newNotes.push(index_1.NoteSequence.Note.create(n));
        }
    });
    // Sort the notes by instrument, and then by time.
    var output = clone(originalSequence);
    output.notes = newNotes.sort(function (a, b) {
        var voiceCompare = a.instrument - b.instrument;
        if (voiceCompare) {
            return voiceCompare;
        }
        return a.quantizedStartStep - b.quantizedStartStep;
    });
    return output;
}
/**
 * Any consecutive notes of the same pitch are merged into a sustained note.
 * Does not merge notes that connect on a measure boundary. This process
 * also rearranges the order of the notes - notes are grouped by instrument,
 * then ordered by timestamp.
 *
 * @param sequence A quantized `NoteSequence` to be merged.
 * @return a new `NoteSequence` with sustained notes merged.
 */
function mergeConsecutiveNotes(sequence) {
    assertIsQuantizedSequence(sequence);
    var output = clone(sequence);
    output.notes = [];
    // Sort the input notes.
    var newNotes = sequence.notes.sort(function (a, b) {
        var voiceCompare = a.instrument - b.instrument;
        if (voiceCompare) {
            return voiceCompare;
        }
        return a.quantizedStartStep - b.quantizedStartStep;
    });
    // Start with the first note.
    var note = new index_1.NoteSequence.Note();
    note.pitch = newNotes[0].pitch;
    note.instrument = newNotes[0].instrument;
    note.quantizedStartStep = newNotes[0].quantizedStartStep;
    note.quantizedEndStep = newNotes[0].quantizedEndStep;
    output.notes.push(note);
    var o = 0;
    for (var i = 1; i < newNotes.length; i++) {
        var thisNote = newNotes[i];
        var previousNote = output.notes[o];
        // Compare next note's start time with previous note's end time.
        if (previousNote.instrument === thisNote.instrument &&
            previousNote.pitch === thisNote.pitch &&
            thisNote.quantizedStartStep === previousNote.quantizedEndStep &&
            // Doesn't start on the measure boundary.
            thisNote.quantizedStartStep % 16 !== 0) {
            // If the next note has the same pitch as this note and starts at the
            // same time as the previous note ends, absorb the next note into the
            // previous output note.
            output.notes[o].quantizedEndStep +=
                thisNote.quantizedEndStep - thisNote.quantizedStartStep;
        }
        else {
            // Otherwise, append the next note to the output notes.
            var note_1 = new index_1.NoteSequence.Note();
            note_1.pitch = newNotes[i].pitch;
            note_1.instrument = newNotes[i].instrument;
            note_1.quantizedStartStep = newNotes[i].quantizedStartStep;
            note_1.quantizedEndStep = newNotes[i].quantizedEndStep;
            output.notes.push(note_1);
            o++;
        }
    }
    return output;
}
/**
 * Create a new NoteSequence with sustain pedal control changes applied.
 *
 * Extends each note within a sustain to either the beginning of the next
 * note of the same pitch or the end of the sustain period, whichever happens
 * first. This is done on a per instrument basis, so notes are only affected
 * by sustain events for the same instrument. Drum notes will not be
 * modified.
 *
 * @param noteSequence The NoteSequence for which to apply sustain. This
 * object will not be modified.
 * @param sustainControlNumber The MIDI control number for sustain pedal.
 * Control events with this number and value 0-63 will be treated as sustain
 * pedal OFF events, and control events with this number and value 64-127
 * will be treated as sustain pedal ON events.
 * @returns A copy of `note_sequence` but with note end times extended to
 * account for sustain.
 *
 * @throws {Error}: If `note_sequence` is quantized.
 * Sustain can only be applied to unquantized note sequences.
 */
function applySustainControlChanges(noteSequence, sustainControlNumber) {
    if (sustainControlNumber === void 0) { sustainControlNumber = 64; }
    var MessageType;
    (function (MessageType) {
        MessageType[MessageType["SUSTAIN_ON"] = 0] = "SUSTAIN_ON";
        MessageType[MessageType["SUSTAIN_OFF"] = 1] = "SUSTAIN_OFF";
        MessageType[MessageType["NOTE_ON"] = 2] = "NOTE_ON";
        MessageType[MessageType["NOTE_OFF"] = 3] = "NOTE_OFF";
    })(MessageType || (MessageType = {}));
    var isQuantized = isQuantizedSequence(noteSequence);
    if (isQuantized) {
        throw new Error('Can only apply sustain to unquantized NoteSequence.');
    }
    var sequence = clone(noteSequence);
    // Sort all note on/off and sustain on/off events.
    var events = [];
    for (var _i = 0, _a = sequence.notes; _i < _a.length; _i++) {
        var note = _a[_i];
        if (note.isDrum === false) {
            if (note.startTime !== null) {
                events.push({
                    time: note.startTime,
                    type: MessageType.NOTE_ON,
                    event: note
                });
            }
            if (note.endTime !== null) {
                events.push({
                    time: note.endTime,
                    type: MessageType.NOTE_OFF,
                    event: note
                });
            }
        }
    }
    for (var _b = 0, _c = sequence.controlChanges; _b < _c.length; _b++) {
        var cc = _c[_b];
        if (cc.controlNumber === sustainControlNumber) {
            var value = cc.controlValue;
            if ((value < 0) || (value > 127)) {
                // warning: out of range
            }
            if (value >= 64) {
                events.push({
                    time: cc.time,
                    type: MessageType.SUSTAIN_ON,
                    event: cc
                });
            }
            else if (value < 64) {
                events.push({
                    time: cc.time,
                    type: MessageType.SUSTAIN_OFF,
                    event: cc
                });
            }
        }
    }
    // Sort, using the time and event type constants to ensure the order events
    // are processed.
    events.sort(function (a, b) { return a.time - b.time; });
    // Lists of active notes, keyed by instrument.
    var activeNotes = {};
    // Whether sustain is active for a given instrument.
    var susActive = {};
    // Iterate through all sustain on/off and note on/off events in order.
    var time = 0;
    for (var _d = 0, events_1 = events; _d < events_1.length; _d++) {
        var item = events_1[_d];
        time = item.time;
        var type = item.type;
        var event_1 = item.event;
        if (type === MessageType.SUSTAIN_ON) {
            susActive[event_1.instrument] = true;
        }
        else if (type === MessageType.SUSTAIN_OFF) {
            susActive[event_1.instrument] = false;
            // End all notes for the instrument that were being extended.
            var newActiveNotes = [];
            if (!(event_1.instrument in activeNotes)) {
                activeNotes[event_1.instrument] = [];
            }
            for (var _e = 0, _f = activeNotes[event_1.instrument]; _e < _f.length; _e++) {
                var note = _f[_e];
                if (note.endTime < time) {
                    // This note was being extended because of sustain.
                    // Update the end time and don't keep it in the list.
                    note.endTime = time;
                    if (time > sequence.totalTime) {
                        sequence.totalTime = time;
                    }
                }
                else {
                    // This note is actually still active, keep it.
                    newActiveNotes.push(note);
                }
            }
            activeNotes[event_1.instrument] = newActiveNotes;
        }
        else if (type === MessageType.NOTE_ON) {
            if (susActive[event_1.instrument] === true) {
                // If sustain is on, end all previous notes with the same pitch.
                var newActiveNotes = [];
                if (!(event_1.instrument in activeNotes)) {
                    activeNotes[event_1.instrument] = [];
                }
                for (var _g = 0, _h = activeNotes[event_1.instrument]; _g < _h.length; _g++) {
                    var note = _h[_g];
                    if (note.pitch === event_1.pitch) {
                        note.endTime = time;
                        if (note.startTime === note.endTime) {
                            // This note now has no duration because another note of the
                            // same pitch started at the same time. Only one of these
                            // notes should be preserved, so delete this one.
                            sequence.notes.push(note);
                        }
                    }
                    else {
                        newActiveNotes.push(note);
                    }
                }
                activeNotes[event_1.instrument] = newActiveNotes;
            }
            // Add this new note to the list of active notes.
            if (!(event_1.instrument in activeNotes)) {
                activeNotes[event_1.instrument] = [];
            }
            activeNotes[event_1.instrument].push(event_1);
        }
        else if (type === MessageType.NOTE_OFF) {
            if (susActive[event_1.instrument] === true) {
                //pass
            }
            else {
                // Remove this particular note from the active list.
                // It may have already been removed if a note of the same pitch was
                // played when sustain was active.
                var index = activeNotes[event_1.instrument].indexOf(event_1);
                if (index > -1) {
                    activeNotes[event_1.instrument].splice(index, 1);
                }
            }
        }
    }
    // End any notes that were still active due to sustain.
    for (var _j = 0, _k = Object.values(activeNotes); _j < _k.length; _j++) {
        var instrument = _k[_j];
        for (var _l = 0, instrument_1 = instrument; _l < instrument_1.length; _l++) {
            var note = instrument_1[_l];
            note.endTime = time;
            sequence.totalTime = time;
        }
    }
    return sequence;
}
/*
 * Concatenate a series of NoteSequences together.
 *
 * Individual sequences will be shifted and then merged together.
 * @param concatenateSequences An array of `NoteSequences` to be concatenated.
 * @param sequenceDurations (Optional) An array of durations for each of the
 * `NoteSequences` in `args`. If not provided, the `totalTime` /
 * `totalQuantizedSteps` of each sequence will be used. Specifying durations is
 * useful if the sequences to be concatenated are effectively longer than
 * their `totalTime` (e.g., a sequence that ends with a rest).
 *
 * @returns A new sequence that is the result of concatenating the input
 * sequences.
 */
function concatenate(concatenateSequences, sequenceDurations) {
    if (sequenceDurations &&
        sequenceDurations.length !== concatenateSequences.length) {
        throw new Error("Number of sequences to concatenate and their individual\n durations does not match.");
    }
    if (isQuantizedSequence(concatenateSequences[0])) {
        // Check that all the sequences are quantized, and that their quantization
        // info matches.
        for (var i = 0; i < concatenateSequences.length; ++i) {
            assertIsQuantizedSequence(concatenateSequences[i]);
            if (concatenateSequences[i].quantizationInfo.stepsPerQuarter !==
                concatenateSequences[0].quantizationInfo.stepsPerQuarter) {
                throw new Error('Not all sequences have the same quantizationInfo');
            }
        }
        return concatenateHelper(concatenateSequences, 'totalQuantizedSteps', 'quantizedStartStep', 'quantizedEndStep', sequenceDurations);
    }
    else {
        return concatenateHelper(concatenateSequences, 'totalTime', 'startTime', 'endTime', sequenceDurations);
    }
}
/**
 * Trim notes from a NoteSequence to lie within a specified time range.
 * Notes starting before `start` are not included. Notes ending after
 * `end` are not included, unless `truncateEndNotes` is true.
 * @param ns The NoteSequence for which to trim notes.
 * @param start The time after which all notes should begin. This should be
 * either seconds (if ns is unquantized), or a quantized step (if ns is
 * quantized).
 * @param end The time before which all notes should end. This should be
 * either seconds (if ns is unquantized), or a quantized step (if ns is
 * quantized).
 * @param truncateEndNotes Optional. If true, then notes starting before
 * the end time but ending after it will be included and truncated.
 * @returns A new NoteSequence with all notes trimmed to lie between `start`
 * and `end`, and time-shifted to begin at 0.
 */
function trim(ns, start, end, truncateEndNotes) {
    return isQuantizedSequence(ns) ?
        trimHelper(ns, start, end, 'totalQuantizedSteps', 'quantizedStartStep', 'quantizedEndStep', truncateEndNotes) :
        trimHelper(ns, start, end, 'totalTime', 'startTime', 'endTime', truncateEndNotes);
}
function concatenateHelper(seqs, totalKey, startKey, endKey, sequenceDurations) {
    var concatSeq;
    var totalDuration = 0;
    for (var i = 0; i < seqs.length; ++i) {
        var seqDuration = sequenceDurations ? sequenceDurations[i] : seqs[i][totalKey];
        if (seqDuration === 0) {
            throw Error("Sequence ".concat(seqs[i].id, " has no ").concat(totalKey, ", and no individual duration was provided."));
        }
        if (i === 0) {
            concatSeq = clone(seqs[0]);
        }
        else {
            Array.prototype.push.apply(concatSeq.notes, seqs[i].notes.map(function (n) {
                var newN = index_1.NoteSequence.Note.create(n);
                newN[startKey] += totalDuration;
                newN[endKey] += totalDuration;
                return newN;
            }));
        }
        totalDuration += seqDuration;
    }
    concatSeq[totalKey] = totalDuration;
    return concatSeq;
}
function trimHelper(ns, start, end, totalKey, startKey, endKey, truncateEndNotes) {
    var result = clone(ns);
    result[totalKey] = end;
    result.notes = result.notes.filter(function (n) { return n[startKey] >= start && n[startKey] <= end &&
        (truncateEndNotes || n[endKey] <= end); });
    // Shift the sequence to start at 0.
    result[totalKey] -= start;
    for (var i = 0; i < result.notes.length; i++) {
        result.notes[i][startKey] -= start;
        result.notes[i][endKey] -= start;
        if (truncateEndNotes) {
            result.notes[i][endKey] = Math.min(result.notes[i][endKey], result[totalKey]);
        }
    }
    return result;
}
/**
 * Splits a quantized `NoteSequence` into smaller `NoteSequences` of
 * equal chunks. If a note splits across a chunk boundary, then it will be
 * split between the two chunks.
 *
 * Silent padding may be added to the final chunk to make it `chunkSize`.
 *
 * @param ns The `NoteSequence` to split.
 * @param chunkSize The number of steps per chunk. For example, if you want to
 * split the sequence into 2 bar chunks, then if the sequence has 4
 * steps/quarter, that will be 32 steps for each 2 bars (so a chunkSize of 32).
 *
 * @returns An array of `NoteSequences` each of which are at most `chunkSize`
 * steps.
 */
function split(seq, chunkSize) {
    assertIsQuantizedSequence(seq);
    // Make a clone so that we don't destroy the input.
    var ns = clone(seq);
    // Sort notes first.
    var notesBystartStep = ns.notes.sort(function (a, b) { return a.quantizedStartStep - b.quantizedStartStep; });
    var chunks = [];
    var startStep = 0;
    var currentNotes = [];
    for (var i = 0; i < notesBystartStep.length; i++) {
        var note = notesBystartStep[i];
        var originalStartStep = note.quantizedStartStep;
        var originalEndStep = note.quantizedEndStep;
        // Rebase this note on the current chunk.
        note.quantizedStartStep -= startStep;
        note.quantizedEndStep -= startStep;
        if (note.quantizedStartStep < 0) {
            continue;
        }
        // If this note fits in the chunk, add it to the current sequence.
        if (note.quantizedEndStep <= chunkSize) {
            currentNotes.push(note);
        }
        else {
            // If this note spills over, truncate it and add it to this sequence.
            if (note.quantizedStartStep < chunkSize) {
                var newNote = index_1.NoteSequence.Note.create(note);
                newNote.quantizedEndStep = chunkSize;
                // Clear any absolute times since they're not valid.
                newNote.startTime = newNote.endTime = undefined;
                currentNotes.push(newNote);
                // Keep the rest of this note, and make sure that next loop still deals
                // with it, and reset it for the next loop.
                note.quantizedStartStep = startStep + chunkSize;
                note.quantizedEndStep = originalEndStep;
            }
            else {
                // We didn't truncate this note at all, so reset it for the next loop.
                note.quantizedStartStep = originalStartStep;
                note.quantizedEndStep = originalEndStep;
            }
            // Do we need to look at this note again?
            if (note.quantizedEndStep > chunkSize ||
                note.quantizedStartStep > chunkSize) {
                i = i - 1;
            }
            // Save this chunk if it isn't empty.
            if (currentNotes.length !== 0) {
                var newSequence = clone(ns);
                newSequence.notes = currentNotes;
                newSequence.totalQuantizedSteps = chunkSize;
                chunks.push(newSequence);
            }
            // Start a new chunk.
            currentNotes = [];
            startStep += chunkSize;
        }
    }
    // Deal with the leftover notes we have in the last chunk.
    if (currentNotes.length !== 0) {
        var newSequence = clone(ns);
        newSequence.notes = currentNotes;
        newSequence.totalQuantizedSteps = chunkSize;
        chunks.push(newSequence);
    }
    return chunks;
}
