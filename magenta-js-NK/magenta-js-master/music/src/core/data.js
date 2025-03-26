"use strict";
/**
 * Module containing functionality for creating and using `DataConverter`
 * objects that convert between tensors and `NoteSequence`s. A `DataConverter`
 * is created from a `ConverterSpec` (typically read from JSON) that specifies
 * the converter type and optional arguments.
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrooveConverter = exports.MultitrackConverter = exports.TrioRhythmConverter = exports.TrioConverter = exports.MelodyShapeConverter = exports.MelodyRhythmConverter = exports.MelodyConverter = exports.DrumsOneHotConverter = exports.DrumRollConverter = exports.DrumsConverter = exports.DataConverter = exports.DEFAULT_DRUM_PITCH_CLASSES = void 0;
exports.converterFromSpec = converterFromSpec;
/**
 * Imports
 */
var tf = require("@tensorflow/tfjs");
var index_1 = require("../protobuf/index");
var constants = require("./constants");
var constants_1 = require("./constants");
Object.defineProperty(exports, "DEFAULT_DRUM_PITCH_CLASSES", { enumerable: true, get: function () { return constants_1.DEFAULT_DRUM_PITCH_CLASSES; } });
var logging = require("./logging");
var melodies_1 = require("./melodies");
var performance = require("./performance");
var sequences = require("./sequences");
/**
 * Builds a `DataConverter` based on the given `ConverterSpec`.
 *
 * @param spec Specifies the `DataConverter` to build.
 * @returns A new `DataConverter` object based on `spec`.
 */
function converterFromSpec(spec) {
    switch (spec.type) {
        case 'MelodyConverter':
            return new MelodyConverter(spec.args);
        case 'MelodyRhythmConverter':
            return new MelodyRhythmConverter(spec.args);
        case 'MelodyShapeConverter':
            return new MelodyShapeConverter(spec.args);
        case 'DrumsConverter':
            return new DrumsConverter(spec.args);
        case 'DrumRollConverter':
            return new DrumRollConverter(spec.args);
        case 'TrioConverter':
            return new TrioConverter(spec.args);
        case 'TrioRhythmConverter':
            return new TrioRhythmConverter(spec.args);
        case 'DrumsOneHotConverter':
            return new DrumsOneHotConverter(spec.args);
        case 'MultitrackConverter':
            return new MultitrackConverter(spec.args);
        case 'GrooveConverter':
            return new GrooveConverter(spec.args);
        default:
            throw new Error("Unknown DataConverter type: ".concat(spec));
    }
}
/**
 * Abstract DataConverter class for converting between `Tensor` and
 * `NoteSequence` objects. Each subclass handles a particular type of musical
 * sequence e.g. monophonic melody or (a few different representations of) drum
 * track.
 */
var DataConverter = /** @class */ (function () {
    function DataConverter(args) {
        this.NUM_SPLITS = 0; // Const number of conductor splits.
        this.SEGMENTED_BY_TRACK = false; // Segments are tracks.
        this.numSteps = args.numSteps;
        this.numSegments = args.numSegments;
    }
    DataConverter.prototype.tensorSteps = function (tensor) {
        return tf.scalar(tensor.shape[0], 'int32');
    };
    return DataConverter;
}());
exports.DataConverter = DataConverter;
var DrumsConverter = /** @class */ (function (_super) {
    __extends(DrumsConverter, _super);
    function DrumsConverter(args) {
        var _this = _super.call(this, args) || this;
        _this.pitchClasses = args.pitchClasses || constants_1.DEFAULT_DRUM_PITCH_CLASSES;
        _this.pitchToClass = new Map();
        var _loop_1 = function (c) {
            this_1.pitchClasses[c].forEach(function (p) {
                _this.pitchToClass.set(p, c);
            });
        };
        var this_1 = this;
        for (var c = 0; c < _this.pitchClasses.length; ++c) {
            _loop_1(c);
        }
        _this.depth = _this.pitchClasses.length + 1;
        return _this;
    }
    DrumsConverter.prototype.toTensor = function (noteSequence) {
        var _this = this;
        sequences.assertIsQuantizedSequence(noteSequence);
        var numSteps = this.numSteps || noteSequence.totalQuantizedSteps;
        var drumRoll = tf.buffer([numSteps, this.pitchClasses.length + 1], 'int32');
        // Set final values to 1 and change to 0 later if the column gets a note.
        for (var i = 0; i < numSteps; ++i) {
            drumRoll.set(1, i, -1);
        }
        noteSequence.notes.forEach(function (note) {
            drumRoll.set(1, note.quantizedStartStep, _this.pitchToClass.get(note.pitch));
            drumRoll.set(0, note.quantizedStartStep, -1);
        });
        return drumRoll.toTensor();
    };
    DrumsConverter.prototype.toNoteSequence = function (oh, stepsPerQuarter, qpm) {
        return __awaiter(this, void 0, void 0, function () {
            var noteSequence, labelsTensor, labels, s, p;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        noteSequence = sequences.createQuantizedNoteSequence(stepsPerQuarter, qpm);
                        labelsTensor = oh.argMax(1);
                        return [4 /*yield*/, labelsTensor.data()];
                    case 1:
                        labels = _a.sent();
                        labelsTensor.dispose();
                        for (s = 0; s < labels.length; ++s) { // step
                            for (p = 0; p < this.pitchClasses.length; p++) { // pitch class
                                if (labels[s] >> p & 1) {
                                    noteSequence.notes.push(index_1.NoteSequence.Note.create({
                                        pitch: this.pitchClasses[p][0],
                                        quantizedStartStep: s,
                                        quantizedEndStep: s + 1,
                                        isDrum: true
                                    }));
                                }
                            }
                        }
                        noteSequence.totalQuantizedSteps = labels.length;
                        return [2 /*return*/, noteSequence];
                }
            });
        });
    };
    return DrumsConverter;
}(DataConverter));
exports.DrumsConverter = DrumsConverter;
/**
 * Converts between a quantized `NoteSequence` containing a drum sequence
 * and the `Tensor` objects used by `MusicVAE`.
 *
 * The `Tensor` output by `toTensor` is the same 2D "drum roll" as in
 * `DrumsConverter`.
 *
 * The expected `Tensor` in `toNoteSequence` is the same as the "drum roll",
 * excluding the final NOR column.
 *
 * The output `NoteSequence` uses quantized time and only the first pitch in
 * pitch class are used.
 */
var DrumRollConverter = /** @class */ (function (_super) {
    __extends(DrumRollConverter, _super);
    function DrumRollConverter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DrumRollConverter.prototype.toNoteSequence = function (roll, stepsPerQuarter, qpm) {
        return __awaiter(this, void 0, void 0, function () {
            var noteSequence, flatRoll, s, pitches, p;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        noteSequence = sequences.createQuantizedNoteSequence(stepsPerQuarter, qpm);
                        return [4 /*yield*/, roll.data()];
                    case 1:
                        flatRoll = _a.sent();
                        for (s = 0; s < roll.shape[0]; ++s) { // step
                            pitches = flatRoll.slice(s * this.pitchClasses.length, (s + 1) * this.pitchClasses.length);
                            for (p = 0; p < pitches.length; ++p) { // pitch class
                                if (pitches[p]) {
                                    noteSequence.notes.push(index_1.NoteSequence.Note.create({
                                        pitch: this.pitchClasses[p][0],
                                        quantizedStartStep: s,
                                        quantizedEndStep: s + 1,
                                        isDrum: true
                                    }));
                                }
                            }
                        }
                        noteSequence.totalQuantizedSteps = roll.shape[0];
                        return [2 /*return*/, noteSequence];
                }
            });
        });
    };
    return DrumRollConverter;
}(DrumsConverter));
exports.DrumRollConverter = DrumRollConverter;
/**
 * Converts between a quantized `NoteSequence` containing a drum sequence
 * and the `Tensor` objects used by `MusicRNN`.
 *
 * The `Tensor` output by `toTensor` is a 2D one-hot encoding. Each
 * row is a time step, and each column is a one-hot vector where each drum
 * combination is mapped to a single bit of a binary integer representation,
 * where the bit has value 0 if the drum combination is not present, and 1 if
 * it is present.
 *
 * The expected `Tensor` in `toNoteSequence` is the same kind of one-hot
 * encoding as the `Tensor` output by `toTensor`.
 *
 * The output `NoteSequence` uses quantized time and only the first pitch in
 * pitch class are used.
 *
 */
var DrumsOneHotConverter = /** @class */ (function (_super) {
    __extends(DrumsOneHotConverter, _super);
    function DrumsOneHotConverter(args) {
        var _this = _super.call(this, args) || this;
        _this.depth = Math.pow(2, _this.pitchClasses.length);
        return _this;
    }
    DrumsOneHotConverter.prototype.toTensor = function (noteSequence) {
        var _this = this;
        sequences.assertIsRelativeQuantizedSequence(noteSequence);
        var numSteps = this.numSteps || noteSequence.totalQuantizedSteps;
        var labels = Array(numSteps).fill(0);
        for (var _i = 0, _a = noteSequence.notes; _i < _a.length; _i++) {
            var _b = _a[_i], pitch = _b.pitch, quantizedStartStep = _b.quantizedStartStep;
            labels[quantizedStartStep] += Math.pow(2, this.pitchToClass.get(pitch));
        }
        return tf.tidy(function () {
            return tf.oneHot(tf.tensor1d(labels, 'int32'), _this.depth);
        });
    };
    return DrumsOneHotConverter;
}(DrumsConverter));
exports.DrumsOneHotConverter = DrumsOneHotConverter;
var MelodyConverter = /** @class */ (function (_super) {
    __extends(MelodyConverter, _super);
    function MelodyConverter(args) {
        var _this = _super.call(this, args) || this;
        _this.NOTE_OFF = 1; // const
        _this.FIRST_PITCH = 2; // const
        _this.minPitch = args.minPitch;
        _this.maxPitch = args.maxPitch;
        _this.ignorePolyphony = args.ignorePolyphony;
        _this.depth = args.maxPitch - args.minPitch + 1 + _this.FIRST_PITCH;
        return _this;
    }
    MelodyConverter.prototype.toTensor = function (noteSequence) {
        var _this = this;
        var melody = melodies_1.Melody.fromNoteSequence(noteSequence, this.minPitch, this.maxPitch, this.ignorePolyphony, this.numSteps);
        return tf.tidy(function () { return tf.oneHot(tf.tensor(melody.events, [melody.events.length], 'int32'), _this.depth); });
    };
    MelodyConverter.prototype.toNoteSequence = function (oh, stepsPerQuarter, qpm) {
        return __awaiter(this, void 0, void 0, function () {
            var labelsTensor, labels, melody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        labelsTensor = oh.argMax(1);
                        return [4 /*yield*/, labelsTensor.data()];
                    case 1:
                        labels = _a.sent();
                        labelsTensor.dispose();
                        melody = new melodies_1.Melody(labels, this.minPitch, this.maxPitch);
                        return [2 /*return*/, melody.toNoteSequence(stepsPerQuarter, qpm)];
                }
            });
        });
    };
    return MelodyConverter;
}(DataConverter));
exports.MelodyConverter = MelodyConverter;
/**
 * Abstract `MelodyControlConverter` class for handling melody control signals.
 * The `toTensor` method first extracts a monophonic melody from the
 * `NoteSequence` then extracts the control signal from the melody. The
 * `toNoteSequence` method is left undefined here but can be used by subclasses
 * for debugging purposes.
 *
 * @param numSteps The length of each sequence.
 * @param minPitch The minimum melody pitch.
 * @param maxPitch The maximum melody pitch.
 * @param ignorePolpyhony Whether to raise an error if multiple notes start at
 * the same step.
 * @param numSegments (Optional) The number of conductor segments.
 */
var MelodyControlConverter = /** @class */ (function (_super) {
    __extends(MelodyControlConverter, _super);
    function MelodyControlConverter(args, melodyControl) {
        var _this = _super.call(this, args) || this;
        _this.minPitch = args.minPitch;
        _this.maxPitch = args.maxPitch;
        _this.ignorePolyphony = args.ignorePolyphony;
        _this.melodyControl = melodyControl;
        _this.depth = melodyControl.depth;
        return _this;
    }
    MelodyControlConverter.prototype.toTensor = function (noteSequence) {
        var melody = melodies_1.Melody.fromNoteSequence(noteSequence, this.minPitch, this.maxPitch, this.ignorePolyphony, this.numSteps);
        return this.melodyControl.extract(melody);
    };
    return MelodyControlConverter;
}(DataConverter));
/**
 * Converts between a monophonic, quantized `NoteSequence` containing a melody
 * and a `Tensor` representing only the *rhythm* of the melody.
 *
 * The rhythm is represented as a [`numSteps`, 1]-shaped `Tensor` with 1 in the
 * positions corresponding to steps with a note-on and 0 elsewhere.
 *
 * Since the melody cannot be reconstructed from its rhythm alone,
 * `toNoteSequence` returns a `NoteSequence` with drum hits at the note-on
 * steps.
 */
var MelodyRhythmConverter = /** @class */ (function (_super) {
    __extends(MelodyRhythmConverter, _super);
    function MelodyRhythmConverter(args) {
        return _super.call(this, args, new melodies_1.MelodyRhythm()) || this;
    }
    MelodyRhythmConverter.prototype.toNoteSequence = function (tensor, stepsPerQuarter, qpm) {
        return __awaiter(this, void 0, void 0, function () {
            var noteSequence, rhythm, s;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        noteSequence = sequences.createQuantizedNoteSequence(stepsPerQuarter, qpm);
                        return [4 /*yield*/, tensor.data()];
                    case 1:
                        rhythm = _a.sent();
                        for (s = 0; s < rhythm.length; ++s) {
                            if (rhythm[s]) {
                                noteSequence.notes.push(index_1.NoteSequence.Note.create({
                                    pitch: constants_1.DEFAULT_DRUM_PITCH_CLASSES[1][0], // snare
                                    quantizedStartStep: s,
                                    quantizedEndStep: s + 1,
                                    isDrum: true
                                }));
                            }
                        }
                        noteSequence.totalQuantizedSteps = rhythm.length;
                        return [2 /*return*/, noteSequence];
                }
            });
        });
    };
    return MelodyRhythmConverter;
}(MelodyControlConverter));
exports.MelodyRhythmConverter = MelodyRhythmConverter;
/**
 * Converts between a monophonic, quantized `NoteSequence` containing a melody
 * and a `Tensor` representing only the *shape* of the melody.
 *
 * The shape is represented as a [`numSteps`, 3]-shaped `Tensor` containing a
 * one-hot Parsons code, where 0 = descending pitch, 1 = same pitch, and 2 =
 * ascending pitch.
 *
 * Since the melody cannot be reconstructed from its shape alone,
 * `toNoteSequence` returns a `NoteSequence` having the shape of the contour
 * with a note at each time step.
 */
var MelodyShapeConverter = /** @class */ (function (_super) {
    __extends(MelodyShapeConverter, _super);
    function MelodyShapeConverter(args) {
        return _super.call(this, args, new melodies_1.MelodyShape()) || this;
    }
    MelodyShapeConverter.prototype.toNoteSequence = function (oh, stepsPerQuarter, qpm) {
        return __awaiter(this, void 0, void 0, function () {
            var noteSequence, shapeTensor, shape, pitch, s;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        noteSequence = sequences.createQuantizedNoteSequence(stepsPerQuarter, qpm);
                        shapeTensor = oh.argMax(1);
                        return [4 /*yield*/, shapeTensor.data()];
                    case 1:
                        shape = _a.sent();
                        shapeTensor.dispose();
                        pitch = Math.round((this.maxPitch + this.minPitch) / 2);
                        for (s = 0; s < shape.length; ++s) {
                            switch (shape[s]) {
                                case 0:
                                    pitch -= 1;
                                    if (pitch < this.minPitch) {
                                        pitch = this.minPitch;
                                        logging.log('Pitch range exceeded when creating NoteSequence from shape.', 'MelodyShapeConverter');
                                    }
                                    break;
                                case 2:
                                    pitch += 1;
                                    if (pitch > this.maxPitch) {
                                        pitch = this.maxPitch;
                                        logging.log('Pitch range exceeded when creating NoteSequence from shape.', 'MelodyShapeConverter');
                                    }
                                    break;
                                default:
                                    break;
                            }
                            noteSequence.notes.push(index_1.NoteSequence.Note.create({ pitch: pitch, quantizedStartStep: s, quantizedEndStep: s + 1 }));
                        }
                        noteSequence.totalQuantizedSteps = shape.length;
                        return [2 /*return*/, noteSequence];
                }
            });
        });
    };
    return MelodyShapeConverter;
}(MelodyControlConverter));
exports.MelodyShapeConverter = MelodyShapeConverter;
var TrioConverter = /** @class */ (function (_super) {
    __extends(TrioConverter, _super);
    function TrioConverter(args) {
        var _this = _super.call(this, args) || this;
        _this.NUM_SPLITS = 3; // const
        _this.MEL_PROG_RANGE = [0, 31]; // inclusive, const
        _this.BASS_PROG_RANGE = [32, 39]; // inclusive, const
        // Copy numSteps to all converters.
        args.melArgs.numSteps = args.numSteps;
        args.bassArgs.numSteps = args.numSteps;
        args.drumsArgs.numSteps = args.numSteps;
        _this.melConverter = new MelodyConverter(args.melArgs);
        _this.bassConverter = new MelodyConverter(args.bassArgs);
        _this.drumsConverter = new DrumsOneHotConverter(args.drumsArgs);
        _this.depth =
            (_this.melConverter.depth + _this.bassConverter.depth +
                _this.drumsConverter.depth);
        return _this;
    }
    TrioConverter.prototype.toTensor = function (noteSequence) {
        var _this = this;
        sequences.assertIsQuantizedSequence(noteSequence);
        var melSeq = sequences.clone(noteSequence);
        var bassSeq = sequences.clone(noteSequence);
        var drumsSeq = sequences.clone(noteSequence);
        melSeq.notes = noteSequence.notes.filter(function (n) {
            return (!n.isDrum && n.program >= _this.MEL_PROG_RANGE[0] &&
                n.program <= _this.MEL_PROG_RANGE[1]);
        });
        bassSeq.notes = noteSequence.notes.filter(function (n) {
            return (!n.isDrum && n.program >= _this.BASS_PROG_RANGE[0] &&
                n.program <= _this.BASS_PROG_RANGE[1]);
        });
        drumsSeq.notes = noteSequence.notes.filter(function (n) { return n.isDrum; });
        return tf.tidy(function () { return tf.concat([
            _this.melConverter.toTensor(melSeq),
            _this.bassConverter.toTensor(bassSeq),
            _this.drumsConverter.toTensor(drumsSeq)
        ], -1); });
    };
    TrioConverter.prototype.toNoteSequence = function (th, stepsPerQuarter, qpm) {
        return __awaiter(this, void 0, void 0, function () {
            var ohs, ns, bassNs, drumsNs;
            var _a, _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        ohs = tf.split(th, [
                            this.melConverter.depth, this.bassConverter.depth,
                            this.drumsConverter.depth
                        ], -1);
                        return [4 /*yield*/, this.melConverter.toNoteSequence(ohs[0], stepsPerQuarter, qpm)];
                    case 1:
                        ns = _c.sent();
                        ns.notes.forEach(function (n) {
                            n.instrument = 0;
                            n.program = 0;
                        });
                        return [4 /*yield*/, this.bassConverter.toNoteSequence(ohs[1], stepsPerQuarter, qpm)];
                    case 2:
                        bassNs = _c.sent();
                        (_a = ns.notes).push.apply(_a, bassNs.notes.map(function (n) {
                            n.instrument = 1;
                            n.program = _this.BASS_PROG_RANGE[0];
                            return n;
                        }));
                        return [4 /*yield*/, this.drumsConverter.toNoteSequence(ohs[2], stepsPerQuarter, qpm)];
                    case 3:
                        drumsNs = _c.sent();
                        (_b = ns.notes).push.apply(_b, drumsNs.notes.map(function (n) {
                            n.instrument = 2;
                            return n;
                        }));
                        ohs.forEach(function (oh) { return oh.dispose(); });
                        return [2 /*return*/, ns];
                }
            });
        });
    };
    return TrioConverter;
}(DataConverter));
exports.TrioConverter = TrioConverter;
var TrioRhythmConverter = /** @class */ (function (_super) {
    __extends(TrioRhythmConverter, _super);
    function TrioRhythmConverter(args) {
        var _this = _super.call(this, args) || this;
        _this.NUM_SPLITS = 3;
        _this.trioConverter = new TrioConverter(args);
        _this.depth = 3;
        return _this;
    }
    TrioRhythmConverter.prototype.toTensor = function (noteSequence) {
        var _this = this;
        return tf.tidy(function () {
            var trioTensor = _this.trioConverter.toTensor(noteSequence);
            var instrumentTensors = tf.split(trioTensor, [
                _this.trioConverter.melConverter.depth,
                _this.trioConverter.bassConverter.depth,
                _this.trioConverter.drumsConverter.depth
            ], 1);
            var melodyEvents = tf.argMax(instrumentTensors[0], 1);
            var bassEvents = tf.argMax(instrumentTensors[1], 1);
            var drumsEvents = tf.argMax(instrumentTensors[2], 1);
            var melodyRhythm = tf.greater(melodyEvents, 1);
            var bassRhythm = tf.greater(bassEvents, 1);
            var drumsRhythm = tf.greater(drumsEvents, 0);
            return tf.stack([melodyRhythm, bassRhythm, drumsRhythm], 1);
        });
    };
    TrioRhythmConverter.prototype.toNoteSequence = function (tensor, stepsPerQuarter, qpm) {
        return __awaiter(this, void 0, void 0, function () {
            var rhythmTensors, rhythms, noteSequence, s;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rhythmTensors = tf.split(tensor, 3, 1);
                        return [4 /*yield*/, Promise.all(rhythmTensors.map(function (t) { return t.data(); }))];
                    case 1:
                        rhythms = _a.sent();
                        noteSequence = sequences.createQuantizedNoteSequence(stepsPerQuarter, qpm);
                        for (s = 0; s < this.numSteps; ++s) {
                            if (rhythms[0][s]) {
                                // melody
                                noteSequence.notes.push(index_1.NoteSequence.Note.create({
                                    pitch: 72,
                                    quantizedStartStep: s,
                                    quantizedEndStep: s + 1,
                                    instrument: 0,
                                    program: 0,
                                }));
                            }
                            if (rhythms[1][s]) {
                                // bass
                                noteSequence.notes.push(index_1.NoteSequence.Note.create({
                                    pitch: 36,
                                    quantizedStartStep: s,
                                    quantizedEndStep: s + 1,
                                    instrument: 1,
                                    program: 32,
                                }));
                            }
                            if (rhythms[2][s]) {
                                // drums
                                noteSequence.notes.push(index_1.NoteSequence.Note.create({
                                    pitch: constants_1.DEFAULT_DRUM_PITCH_CLASSES[1][0],
                                    quantizedStartStep: s,
                                    quantizedEndStep: s + 1,
                                    instrument: 2,
                                    isDrum: true
                                }));
                            }
                        }
                        noteSequence.totalQuantizedSteps = this.numSteps;
                        return [2 /*return*/, noteSequence];
                }
            });
        });
    };
    return TrioRhythmConverter;
}(DataConverter));
exports.TrioRhythmConverter = TrioRhythmConverter;
var MultitrackConverter = /** @class */ (function (_super) {
    __extends(MultitrackConverter, _super);
    function MultitrackConverter(args) {
        var _this = _super.call(this, args) || this;
        _this.SEGMENTED_BY_TRACK = true; // const
        _this.stepsPerQuarter = args.stepsPerQuarter;
        _this.totalSteps = args.totalSteps;
        _this.numVelocityBins = args.numVelocityBins;
        _this.minPitch = args.minPitch ? args.minPitch : constants.MIN_MIDI_PITCH;
        _this.maxPitch = args.maxPitch ? args.maxPitch : constants.MAX_MIDI_PITCH;
        // Vocabulary:
        // note-on, note-off, time-shift, velocity-change, program-select,
        // end-token
        _this.numPitches = _this.maxPitch - _this.minPitch + 1;
        _this.performanceEventDepth =
            2 * _this.numPitches + _this.totalSteps + _this.numVelocityBins;
        // Include an extra "program" for drums.
        _this.numPrograms =
            constants.MAX_MIDI_PROGRAM - constants.MIN_MIDI_PROGRAM + 2;
        _this.endToken = _this.performanceEventDepth + _this.numPrograms;
        _this.depth = _this.endToken + 1;
        _this.endTensor = tf.tidy(function () { return tf.oneHot(tf.tensor1d([_this.endToken], 'int32'), _this.depth)
            .as1D(); });
        return _this;
    }
    MultitrackConverter.prototype.trackToTensor = function (track) {
        var _this = this;
        var maxEventsPerTrack = this.numSteps / this.numSegments;
        var tokens = undefined;
        if (track) {
            // Drop events from track until we have the maximum number of events
            // (leaving room for program select and end token).
            while (track.events.length > maxEventsPerTrack - 2) {
                track.events.pop();
            }
            tokens = tf.buffer([track.events.length + 2], 'int32');
            // Add an initial program select token.
            tokens.set(this.performanceEventDepth +
                (track.isDrum ? this.numPrograms - 1 : track.program), 0);
            // Add tokens for each performance event.
            track.events.forEach(function (event, index) {
                switch (event.type) {
                    case 'note-on':
                        tokens.set(event.pitch - _this.minPitch, index + 1);
                        break;
                    case 'note-off':
                        tokens.set(_this.numPitches + event.pitch - _this.minPitch, index + 1);
                        break;
                    case 'time-shift':
                        tokens.set(2 * _this.numPitches + event.steps - 1, index + 1);
                        break;
                    case 'velocity-change':
                        tokens.set(2 * _this.numPitches + _this.totalSteps + event.velocityBin - 1, index + 1);
                        break;
                    default:
                        throw new Error("Unrecognized performance event: ".concat(event));
                }
            });
            // Add a single end token.
            tokens.set(this.endToken, track.events.length + 1);
        }
        else {
            // Track doesn't exist, just use an end token.
            tokens = tf.buffer([1], 'int32', new Int32Array([this.endToken]));
        }
        // Now do one-hot encoding and pad with zeros up to the maximum number of
        // events.
        return tf.tidy(function () {
            var oh = tf.oneHot(tokens.toTensor(), _this.depth);
            return oh.pad([[0, maxEventsPerTrack - oh.shape[0]], [0, 0]]);
        });
    };
    MultitrackConverter.prototype.toTensor = function (noteSequence) {
        var _this = this;
        sequences.assertIsRelativeQuantizedSequence(noteSequence);
        if (noteSequence.quantizationInfo.stepsPerQuarter !==
            this.stepsPerQuarter) {
            throw new Error("Steps per quarter note mismatch: ".concat(noteSequence.quantizationInfo.stepsPerQuarter, " != ").concat(this.stepsPerQuarter));
        }
        // Drop all notes outside the valid pitch range.
        var seq = sequences.clone(noteSequence);
        seq.notes = noteSequence.notes.filter(function (note) { return note.pitch >= _this.minPitch && note.pitch <= _this.maxPitch; });
        var instruments = new Set(seq.notes.map(function (note) { return note.instrument; }));
        var tracks = Array.from(instruments)
            .map(function (instrument) { return performance.Performance.fromNoteSequence(seq, _this.totalSteps, _this.numVelocityBins, instrument); });
        // Sort tracks by program number, with drums at the end.
        var sortedTracks = tracks.sort(function (a, b) { return b.isDrum ? -1 : (a.isDrum ? 1 : a.program - b.program); });
        // Drop tracks until we have the maximum number of instruments.
        while (sortedTracks.length > this.numSegments) {
            sortedTracks.pop();
        }
        // Make sure all tracks are the proper length (in time).
        sortedTracks.forEach(function (track) { return track.setNumSteps(_this.totalSteps); });
        // Pad with "undefined" tracks to reach the desired number of instruments.
        while (sortedTracks.length < this.numSegments) {
            sortedTracks.push(undefined);
        }
        // Convert tracks to tensors then concatenate.
        return tf.tidy(function () { return tf.concat(sortedTracks.map(function (track) { return _this.trackToTensor(track); }), 0); });
    };
    MultitrackConverter.prototype.tokensToTrack = function (tokens) {
        var _this = this;
        // Trim to end token.
        var idx = tokens.indexOf(this.endToken);
        var endIndex = idx >= 0 ? idx : tokens.length;
        var trackTokens = tokens.slice(0, endIndex);
        // Split into performance event tokens and program change tokens.
        var eventTokens = trackTokens.filter(function (token) { return token < _this.performanceEventDepth; });
        var programTokens = trackTokens.filter(function (token) { return token >= _this.performanceEventDepth; });
        // Use the first program token to determine program. If no program tokens,
        // use program zero (piano).
        var _a = programTokens.length ?
            (programTokens[0] - this.performanceEventDepth < this.numPrograms - 1 ?
                [programTokens[0] - this.performanceEventDepth, false] :
                [0, true]) :
            [0, false], program = _a[0], isDrum = _a[1];
        // Decode event tokens.
        var events = Array.from(eventTokens).map(function (token) {
            if (token < _this.numPitches) {
                return { type: 'note-on', pitch: _this.minPitch + token };
            }
            else if (token < 2 * _this.numPitches) {
                return {
                    type: 'note-off',
                    pitch: _this.minPitch + token - _this.numPitches
                };
            }
            else if (token < 2 * _this.numPitches + _this.totalSteps) {
                return {
                    type: 'time-shift',
                    steps: token - 2 * _this.numPitches + 1
                };
            }
            else if (token <
                2 * _this.numPitches + _this.totalSteps + _this.numVelocityBins) {
                return {
                    type: 'velocity-change',
                    velocityBin: token - 2 * _this.numPitches - _this.totalSteps + 1
                };
            }
            else {
                throw new Error("Invalid performance event token: ".concat(token));
            }
        });
        return new performance.Performance(events, this.totalSteps, this.numVelocityBins, program, isDrum);
    };
    MultitrackConverter.prototype.toNoteSequence = function (oh_1) {
        return __awaiter(this, arguments, void 0, function (oh, stepsPerQuarter, qpm) {
            var noteSequence, tensors, tracks;
            var _this = this;
            if (stepsPerQuarter === void 0) { stepsPerQuarter = this.stepsPerQuarter; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        noteSequence = sequences.createQuantizedNoteSequence(stepsPerQuarter, qpm);
                        noteSequence.totalQuantizedSteps = this.totalSteps;
                        tensors = tf.tidy(function () { return tf.split(oh.argMax(1), _this.numSegments); });
                        return [4 /*yield*/, Promise.all(tensors.map(function (tensor) { return __awaiter(_this, void 0, void 0, function () {
                                var tokens, track;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, tensor.data()];
                                        case 1:
                                            tokens = _a.sent();
                                            track = this.tokensToTrack(tokens);
                                            tensor.dispose();
                                            return [2 /*return*/, track];
                                    }
                                });
                            }); }))];
                    case 1:
                        tracks = _a.sent();
                        tracks.forEach(function (track, instrument) {
                            var _a;
                            // Make sure track is the proper length.
                            track.setNumSteps(_this.totalSteps);
                            // Add notes to main NoteSequence.
                            (_a = noteSequence.notes).push.apply(_a, track.toNoteSequence(instrument).notes);
                        });
                        return [2 /*return*/, noteSequence];
                }
            });
        });
    };
    return MultitrackConverter;
}(DataConverter));
exports.MultitrackConverter = MultitrackConverter;
var GrooveConverter = /** @class */ (function (_super) {
    __extends(GrooveConverter, _super);
    function GrooveConverter(args) {
        var _this = _super.call(this, args) || this;
        _this.TAPIFY_CHANNEL = 3;
        _this.stepsPerQuarter =
            args.stepsPerQuarter || constants.DEFAULT_STEPS_PER_QUARTER;
        _this.pitchClasses = args.pitchClasses || constants_1.DEFAULT_DRUM_PITCH_CLASSES;
        _this.pitchToClass = new Map();
        var _loop_2 = function (c) {
            this_2.pitchClasses[c].forEach(function (p) {
                _this.pitchToClass.set(p, c);
            });
        };
        var this_2 = this;
        for (var c = 0; c < _this.pitchClasses.length; ++c) {
            _loop_2(c);
        }
        _this.humanize = args.humanize || false;
        _this.tapify = args.tapify || false;
        _this.splitInstruments = args.splitInstruments || false;
        // Each drum hit is represented by 3 numbers - on/off, velocity, and
        // offset.
        _this.depth = 3;
        return _this;
    }
    GrooveConverter.prototype.toTensor = function (ns) {
        var _this = this;
        var qns = sequences.isRelativeQuantizedSequence(ns) ?
            ns :
            sequences.quantizeNoteSequence(ns, this.stepsPerQuarter);
        var numSteps = this.numSteps;
        var qpm = (qns.tempos && qns.tempos.length) ?
            qns.tempos[0].qpm :
            constants.DEFAULT_QUARTERS_PER_MINUTE;
        var stepLength = (60. / qpm) / this.stepsPerQuarter;
        // For each quantized time step bin, collect a mapping from each pitch
        // class to at most one drum hit. Break ties by selecting hit with highest
        // velocity.
        var stepNotes = [];
        for (var i = 0; i < numSteps; ++i) {
            stepNotes.push(new Map());
        }
        qns.notes.forEach(function (n) {
            if (!(_this.tapify || _this.pitchToClass.has(n.pitch))) {
                return;
            }
            var s = n.quantizedStartStep;
            if (s >= stepNotes.length) {
                throw Error("Model does not support sequences with more than ".concat(numSteps, " steps (").concat(numSteps * stepLength, " seconds at qpm ").concat(qpm, ")."));
            }
            var d = _this.tapify ? _this.TAPIFY_CHANNEL : _this.pitchToClass.get(n.pitch);
            if (!stepNotes[s].has(d) || stepNotes[s].get(d).velocity < n.velocity) {
                stepNotes[s].set(d, n);
            }
        });
        // For each time step and drum (pitch class), store the value of the
        // hit (bool for whether the drum what hit at that time), velocity
        // ([0, 1] velocity of hit, or 0 if not hit), and offset ([-1, 1] distance
        // from quantized start).
        var numDrums = this.pitchClasses.length;
        var hitVectors = tf.buffer([numSteps, numDrums]);
        var velocityVectors = tf.buffer([numSteps, numDrums]);
        var offsetVectors = tf.buffer([numSteps, numDrums]);
        function getOffset(n) {
            if (n.startTime === undefined) {
                return 0;
            }
            var tOnset = n.startTime;
            var qOnset = n.quantizedStartStep * stepLength;
            return 2 * (qOnset - tOnset) / stepLength;
        }
        // Loop through each step.
        for (var s = 0; s < numSteps; ++s) {
            // Loop through each drum instrument and set the hit, velocity, and
            // offset.
            for (var d = 0; d < numDrums; ++d) {
                var note = stepNotes[s].get(d);
                hitVectors.set(note ? 1 : 0, s, d);
                if (!this.humanize && !this.tapify) {
                    velocityVectors.set(note ? note.velocity / constants.MAX_MIDI_VELOCITY : 0, s, d);
                }
                if (!this.humanize) {
                    offsetVectors.set(note ? getOffset(note) : 0, s, d);
                }
            }
        }
        return tf.tidy(function () {
            var hits = hitVectors.toTensor();
            var velocities = velocityVectors.toTensor();
            var offsets = offsetVectors.toTensor();
            // Stack the three signals, first flattening if splitInstruemnts is
            // enabled.
            var outLength = _this.splitInstruments ? numSteps * numDrums : numSteps;
            return tf.concat([
                hits.as2D(outLength, -1), velocities.as2D(outLength, -1),
                offsets.as2D(outLength, -1)
            ], 1);
        });
    };
    GrooveConverter.prototype.toNoteSequence = function (t_1, stepsPerQuarter_1) {
        return __awaiter(this, arguments, void 0, function (t, stepsPerQuarter, qpm) {
            function clip(v, min, max) {
                return Math.min(Math.max(v, min), max);
            }
            var numSteps, stepLength, ns, results, numDrums, s, stepResults, d, hitOutput, velI, velOutput, offsetI, offsetOutput, velocity, offset;
            if (qpm === void 0) { qpm = constants.DEFAULT_QUARTERS_PER_MINUTE; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (stepsPerQuarter && stepsPerQuarter !== this.stepsPerQuarter) {
                            throw Error('`stepsPerQuarter` is set by the model.');
                        }
                        stepsPerQuarter = this.stepsPerQuarter;
                        numSteps = this.splitInstruments ?
                            t.shape[0] / this.pitchClasses.length :
                            t.shape[0];
                        stepLength = (60. / qpm) / this.stepsPerQuarter;
                        ns = index_1.NoteSequence.create({ totalTime: numSteps * stepLength, tempos: [{ qpm: qpm }] });
                        return [4 /*yield*/, t.data()];
                    case 1:
                        results = _a.sent();
                        numDrums = this.pitchClasses.length;
                        // Loop through time steps.
                        for (s = 0; s < numSteps; ++s) {
                            stepResults = results.slice(s * numDrums * this.depth, (s + 1) * numDrums * this.depth);
                            // Loop through individual drums at each time step.
                            for (d = 0; d < numDrums; ++d) {
                                hitOutput = stepResults[this.splitInstruments ? d * this.depth : d];
                                velI = this.splitInstruments ? (d * this.depth + 1) : (numDrums + d);
                                velOutput = stepResults[velI];
                                offsetI = this.splitInstruments ? (d * this.depth + 2) : (2 * numDrums + d);
                                offsetOutput = stepResults[offsetI];
                                // If hit output is above threshold, add note.
                                if (hitOutput > 0.5) {
                                    velocity = clip(Math.round(velOutput * constants.MAX_MIDI_VELOCITY), constants.MIN_MIDI_VELOCITY, constants.MAX_MIDI_VELOCITY);
                                    offset = clip(offsetOutput / 2, -0.5, 0.5);
                                    ns.notes.push(index_1.NoteSequence.Note.create({
                                        pitch: this.pitchClasses[d][0],
                                        startTime: (s - offset) * stepLength,
                                        endTime: (s - offset + 1) * stepLength,
                                        velocity: velocity,
                                        isDrum: true
                                    }));
                                }
                            }
                        }
                        return [2 /*return*/, ns];
                }
            });
        });
    };
    return GrooveConverter;
}(DataConverter));
exports.GrooveConverter = GrooveConverter;
