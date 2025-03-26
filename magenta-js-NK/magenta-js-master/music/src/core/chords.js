"use strict";
/**
 * Module containing functionality for encoding chord symbol strings as tensors
 * for input to models, typically as a conditioning variable.
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
exports.PitchChordEncoder = exports.TriadChordEncoder = exports.MajorMinorChordEncoder = exports.ChordEncoder = exports.ChordSymbols = exports.ChordEncodingException = exports.ChordSymbolException = exports.ChordQuality = void 0;
exports.chordEncoderFromType = chordEncoderFromType;
/**
 * Imports
 */
var tf = require("@tensorflow/tfjs");
var tonal_1 = require("tonal");
var constants = require("./constants");
var CHORD_QUALITY_INTERVALS = [
    ['1P', '3M', '5P'], // major
    ['1P', '3m', '5P'], // minor
    ['1P', '3M', '5A'], // augmented
    ['1P', '3m', '5d'], // diminished
];
var ChordQuality;
(function (ChordQuality) {
    ChordQuality[ChordQuality["Major"] = 0] = "Major";
    ChordQuality[ChordQuality["Minor"] = 1] = "Minor";
    ChordQuality[ChordQuality["Augmented"] = 2] = "Augmented";
    ChordQuality[ChordQuality["Diminished"] = 3] = "Diminished";
    ChordQuality[ChordQuality["Other"] = 4] = "Other";
})(ChordQuality || (exports.ChordQuality = ChordQuality = {}));
var ChordSymbolException = /** @class */ (function (_super) {
    __extends(ChordSymbolException, _super);
    function ChordSymbolException(message) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, _newTarget.prototype);
        return _this;
    }
    return ChordSymbolException;
}(Error));
exports.ChordSymbolException = ChordSymbolException;
var ChordEncodingException = /** @class */ (function (_super) {
    __extends(ChordEncodingException, _super);
    function ChordEncodingException(message) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, _newTarget.prototype);
        return _this;
    }
    return ChordEncodingException;
}(Error));
exports.ChordEncodingException = ChordEncodingException;
/**
 * Class containing static methods related to chord symbol interpretation. These
 * functions make use of the Tonal.js music theory library, and are used when
 * converting chord symbols to model inputs.
 */
var ChordSymbols = /** @class */ (function () {
    function ChordSymbols() {
    }
    /**
     * Returns an array containing integers (0-11) representing the pitch classes
     * in a chord.
     * @param chord A chord symbol string.
     * @returns An array of integer pitch classes in the chord.
     * @throws {ChordSymbolException} If the chord cannot be recognized.
     */
    ChordSymbols.pitches = function (chord) {
        var root = tonal_1.Chord.tokenize(chord)[0];
        if (!root || !tonal_1.Chord.exists(chord)) {
            throw new ChordSymbolException("Unrecognized chord symbol: ".concat(chord));
        }
        var notes = tonal_1.Chord.notes(chord);
        return notes.map(tonal_1.Note.chroma);
    };
    /**
     * Returns an integer (0-11) representing the pitch class of the chord root.
     * @param chord A chord symbol string.
     * @returns The integer pitch class of the chord root.
     * @throws {ChordSymbolException} If the chord root cannot be determined.
     */
    ChordSymbols.root = function (chord) {
        var root = tonal_1.Chord.tokenize(chord)[0];
        if (!root) {
            throw new ChordSymbolException("Chord symbol has unknown root: ".concat(chord));
        }
        return tonal_1.Note.chroma(root);
    };
    /**
     * Returns the chord quality (major, minor, augmented, diminished, or other).
     * @param chord A chord symbol string.
     * @returns The ChordQuality enum value specifying the quality.
     * @throws {ChordSymbolException} If the chord cannot be recognized.
     */
    ChordSymbols.quality = function (chord) {
        if (!tonal_1.Chord.exists(chord)) {
            throw new ChordSymbolException("Unrecognized chord symbol: ".concat(chord));
        }
        var intervals = tonal_1.Chord.intervals(chord);
        var qualities = CHORD_QUALITY_INTERVALS.map(function (cqis) { return cqis.every(function (cqi) { return intervals.includes(cqi); }); });
        var i = qualities.indexOf(true);
        var j = qualities.lastIndexOf(true);
        if (i >= 0 && i === j) {
            return i;
        }
        else {
            return ChordQuality.Other;
        }
    };
    return ChordSymbols;
}());
exports.ChordSymbols = ChordSymbols;
/**
 * Abstract ChordEncoder class for converting chord symbols to tensors.
 */
var ChordEncoder = /** @class */ (function () {
    function ChordEncoder() {
    }
    /**
     * Encode a chord progression over a specified number of steps.
     *
     * @param chords An array of chord symbol strings.
     * @param numSteps Number of steps to use.
     * @returns A 2D tensor containing the encoded chord progression.
     */
    ChordEncoder.prototype.encodeProgression = function (chords, numSteps) {
        var _this = this;
        var encodedChords = chords.map(function (chord) { return _this.encode(chord); });
        var indices = Array.from(Array(numSteps).keys())
            .map(function (step) { return Math.floor(step * encodedChords.length / numSteps); });
        return tf.stack(indices.map(function (i) { return encodedChords[i]; }));
    };
    return ChordEncoder;
}());
exports.ChordEncoder = ChordEncoder;
/**
 * Creates a `ChordEncoder` based on the given `ChordEncoderType`.
 *
 * @param type Specifies the `ChordEncoder` to create.
 * @returns A new `ChordEncoder` object based on `type`.
 */
function chordEncoderFromType(type) {
    switch (type) {
        case 'MajorMinorChordEncoder':
            return new MajorMinorChordEncoder();
        case 'TriadChordEncoder':
            return new TriadChordEncoder();
        case 'PitchChordEncoder':
            return new PitchChordEncoder();
        default:
            throw new Error("Unknown chord encoder type: ".concat(type));
    }
}
/**
 * ChordEncoder that outputs a one-hot encoding over major and minor triads.
 */
var MajorMinorChordEncoder = /** @class */ (function (_super) {
    __extends(MajorMinorChordEncoder, _super);
    function MajorMinorChordEncoder() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.depth = 1 + 2 * constants.NUM_PITCH_CLASSES;
        return _this;
    }
    MajorMinorChordEncoder.prototype.index = function (chord) {
        if (chord === constants.NO_CHORD) {
            return 0;
        }
        var root = ChordSymbols.root(chord);
        var quality = ChordSymbols.quality(chord);
        var index = 1 + quality * constants.NUM_PITCH_CLASSES + root;
        if (index >= this.depth) {
            throw new ChordEncodingException("Chord is neither major nor minor: ".concat(chord));
        }
        return index;
    };
    MajorMinorChordEncoder.prototype.encode = function (chord) {
        var _this = this;
        return tf.tidy(function () { return tf.oneHot(tf.tensor1d([_this.index(chord)], 'int32'), _this.depth)
            .as1D(); });
    };
    return MajorMinorChordEncoder;
}(ChordEncoder));
exports.MajorMinorChordEncoder = MajorMinorChordEncoder;
/**
 * ChordEncoder that outputs a one-hot encoding over major, minor, augmented,
 * and diminished triads.
 */
var TriadChordEncoder = /** @class */ (function (_super) {
    __extends(TriadChordEncoder, _super);
    function TriadChordEncoder() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.depth = 1 + 4 * constants.NUM_PITCH_CLASSES;
        return _this;
    }
    TriadChordEncoder.prototype.index = function (chord) {
        if (chord === constants.NO_CHORD) {
            return 0;
        }
        var root = ChordSymbols.root(chord);
        var quality = ChordSymbols.quality(chord);
        var index = 1 + quality * constants.NUM_PITCH_CLASSES + root;
        if (index >= this.depth) {
            throw new ChordEncodingException("Chord is not a standard triad: ".concat(chord));
        }
        return index;
    };
    TriadChordEncoder.prototype.encode = function (chord) {
        var _this = this;
        return tf.tidy(function () { return tf.oneHot(tf.tensor1d([_this.index(chord)], 'int32'), _this.depth)
            .as1D(); });
    };
    return TriadChordEncoder;
}(ChordEncoder));
exports.TriadChordEncoder = TriadChordEncoder;
/**
 * ChordEncoder that outputs (concatenated) a one-hot encoding over chord root
 * pitch class, a binary vector indicating the pitch classes contained in the
 * chord, and a one-hot encoding over chord bass pitch class.
 */
var PitchChordEncoder = /** @class */ (function (_super) {
    __extends(PitchChordEncoder, _super);
    function PitchChordEncoder() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.depth = 1 + 3 * constants.NUM_PITCH_CLASSES;
        return _this;
    }
    PitchChordEncoder.prototype.encode = function (chord) {
        var _this = this;
        return tf.tidy(function () {
            if (chord === constants.NO_CHORD) {
                return tf.oneHot(tf.tensor1d([0], 'int32'), _this.depth).as1D();
            }
            var root = ChordSymbols.root(chord);
            var rootEncoding = tf.oneHot(tf.tensor1d([root], 'int32'), constants.NUM_PITCH_CLASSES)
                .as1D();
            var pitchBuffer = tf.buffer([constants.NUM_PITCH_CLASSES]);
            ChordSymbols.pitches(chord).forEach(function (pitch) { return pitchBuffer.set(1.0, pitch); });
            var pitchEncoding = pitchBuffer.toTensor().as1D();
            // Since tonal doesn't understand chords with slash notation to specify
            // bass, just use the root for now.
            var bassEncoding = rootEncoding;
            return tf.concat1d([tf.tensor1d([0.0]), rootEncoding, pitchEncoding, bassEncoding]);
        });
    };
    return PitchChordEncoder;
}(ChordEncoder));
exports.PitchChordEncoder = PitchChordEncoder;
