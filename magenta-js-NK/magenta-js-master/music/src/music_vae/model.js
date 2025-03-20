"use strict";
/**
 * Core implementation for [MusicVAE]{@link https://g.co/magenta/musicvae}
 * models.
 *
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
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
exports.MusicVAE = exports.Nade = exports.Decoder = exports.Encoder = exports.LayerVars = void 0;
/**
 * Imports
 */
var tf = require("@tensorflow/tfjs");
var chords = require("../core/chords");
var global_1 = require("../core/compat/global");
var constants = require("../core/constants");
var data = require("../core/data");
var logging = require("../core/logging");
/**
 * A class for keeping track of the parameters of an affine transformation.
 *
 * @param kernel A 2-dimensional tensor with the kernel parameters.
 * @param bias A 1-dimensional tensor with the bias parameters.
 */
var LayerVars = /** @class */ (function () {
    function LayerVars(kernel, bias) {
        if (kernel === undefined) {
            throw Error('`kernel` is undefined.');
        }
        if (bias === undefined) {
            throw Error('`bias` is undefined.');
        }
        this.kernel = kernel;
        this.bias = bias;
    }
    return LayerVars;
}());
exports.LayerVars = LayerVars;
/**
 * Helper function to compute an affine transformation.
 *
 * @param vars `LayerVars` containing the `kernel` and `bias` of the
 * transformation.
 * @param inputs A batch of input vectors to transform.
 * @hidden
 */
function dense(vars, inputs) {
    return inputs.matMul(vars.kernel).add(vars.bias);
}
/**
 * Abstract Encoder class.
 */
var Encoder = /** @class */ (function () {
    function Encoder() {
    }
    return Encoder;
}());
exports.Encoder = Encoder;
/**
 * A single-layer bidirectional LSTM module.
 */
var BidirectionalLstm = /** @class */ (function () {
    /**
     * `BidirectionalLstm` contructor.
     *
     * @param lstmFwVars The forward LSTM `LayerVars`.
     * @param lstmBwVars The backward LSTM `LayerVars`.
     */
    function BidirectionalLstm(lstmFwVars, lstmBwVars) {
        this.lstmFwVars = lstmFwVars;
        this.lstmBwVars = lstmBwVars;
    }
    /**
     * Processes a batch of sequences.
     * @param sequence The batch of sequences to be processed.
     * @returns A batch of forward and backward output (h) LSTM states.
     */
    BidirectionalLstm.prototype.process = function (sequence) {
        var _this = this;
        return tf.tidy(function () {
            var fwStates = _this.singleDirection(sequence, true);
            var bwStates = _this.singleDirection(sequence, false);
            return [fwStates, bwStates];
        });
    };
    BidirectionalLstm.prototype.singleDirection = function (inputs, fw) {
        var batchSize = inputs.shape[0];
        var length = inputs.shape[1];
        var lstmVars = fw ? this.lstmFwVars : this.lstmBwVars;
        var state = [
            tf.zeros([batchSize, lstmVars.bias.shape[0] / 4]),
            tf.zeros([batchSize, lstmVars.bias.shape[0] / 4])
        ];
        var forgetBias = tf.scalar(1.0);
        var lstm = function (data, state) {
            return tf.basicLSTMCell(forgetBias, lstmVars.kernel, lstmVars.bias, data, state[0], state[1]);
        };
        var splitInputs = tf.split(inputs.toFloat(), length, 1);
        var outputStates = [];
        for (var _i = 0, _a = (fw ? splitInputs : splitInputs.reverse()); _i < _a.length; _i++) {
            var data_1 = _a[_i];
            // Apply LSTM and store output (h) state.
            state = lstm(data_1.squeeze([1]), state);
            outputStates.push(state[1]);
        }
        // Return the output (h) states in chronological order.
        return fw ? outputStates : outputStates.reverse();
    };
    return BidirectionalLstm;
}());
/**
 * A single-layer bidirectional LSTM encoder.
 */
var BidirectionalLstmEncoder = /** @class */ (function (_super) {
    __extends(BidirectionalLstmEncoder, _super);
    /**
     * `BidirectionalLstmEncoder` contructor.
     *
     * @param lstmFwVars The forward LSTM `LayerVars`.
     * @param lstmBwVars The backward LSTM `LayerVars`.
     * @param muVars (Optional) The `LayerVars` for projecting from the final
     * states of the bidirectional LSTM to the mean `mu` of the random variable,
     * `z`. The final states are returned directly if not provided.
     */
    function BidirectionalLstmEncoder(lstmFwVars, lstmBwVars, muVars) {
        var _this = _super.call(this) || this;
        _this.bidirectionalLstm = new BidirectionalLstm(lstmFwVars, lstmBwVars);
        _this.muVars = muVars;
        _this.zDims = muVars ? _this.muVars.bias.shape[0] : null;
        return _this;
    }
    /**
     * Encodes a batch of sequences.
     * @param sequence The batch of sequences to be encoded.
     * @param segmentLengths Unused for this encoder.
     * @returns A batch of concatenated final LSTM states, or the `mu` if `muVars`
     * is known.
     */
    BidirectionalLstmEncoder.prototype.encode = function (sequence, segmentLengths) {
        var _this = this;
        if (segmentLengths) {
            throw new Error('Variable-length segments not supported in flat encoder');
        }
        return tf.tidy(function () {
            var _a = _this.bidirectionalLstm.process(sequence), fwStates = _a[0], bwStates = _a[1];
            var finalState = tf.concat([fwStates[fwStates.length - 1], bwStates[0]], 1);
            if (_this.muVars) {
                return dense(_this.muVars, finalState);
            }
            else {
                return finalState;
            }
        });
    };
    return BidirectionalLstmEncoder;
}(Encoder));
/**
 * A hierarchical encoder that uses the outputs from each level as the inputs
 * to the subsequent level.
 */
var HierarchicalEncoder = /** @class */ (function (_super) {
    __extends(HierarchicalEncoder, _super);
    /**
     * `HierarchicalEncoder` contructor.
     *
     * @param baseEncoders An list of `Encoder` objects to use for each.
     * @param numSteps A list containing the number of steps (outputs) for each
     * level of the hierarchy. This number should evenly divide the inputs for
     * each level. The final entry must always be `1`.
     * @param muVars The `LayerVars` for projecting from the final
     * states of the final level to the mean `mu` of the random variable, `z`.
     */
    function HierarchicalEncoder(baseEncoders, numSteps, muVars) {
        var _this = _super.call(this) || this;
        _this.baseEncoders = baseEncoders;
        _this.numSteps = numSteps;
        _this.muVars = muVars;
        _this.zDims = _this.muVars.bias.shape[0];
        return _this;
    }
    /**
     * Encodes a batch of sequences.
     * @param sequence The batch of sequences to be encoded.
     * @param segmentLengths (Optional) An array of lengths of the base-level
     * segments. Must have length `numSteps[0]`. Assumes that batch size is 1.
     * @returns A batch of `mu` values.
     */
    HierarchicalEncoder.prototype.encode = function (sequence, segmentLengths) {
        var _this = this;
        if (segmentLengths) {
            if (sequence.shape[0] !== 1) {
                throw new Error('When using variable-length segments, batch size must be 1.');
            }
            if (segmentLengths.length !== this.numSteps[0]) {
                throw new Error('Must provide length for all variable-length segments.');
            }
        }
        return tf.tidy(function () {
            var inputs = sequence;
            for (var level = 0; level < _this.baseEncoders.length; ++level) {
                var levelSteps = _this.numSteps[level];
                var splitInputs = tf.split(inputs, levelSteps, 1);
                var embeddings = [];
                for (var step = 0; step < levelSteps; ++step) {
                    embeddings.push(_this.baseEncoders[level].encode((level === 0 && segmentLengths) ?
                        tf.slice3d(splitInputs[step], [0, 0, 0], [1, segmentLengths[step], -1]) :
                        splitInputs[step]));
                }
                inputs = tf.stack(embeddings, 1);
            }
            return dense(_this.muVars, inputs.squeeze([1]));
        });
    };
    return HierarchicalEncoder;
}(Encoder));
/**
 * Helper function to create LSTM cells and initial states for decoders.
 *
 * @param z A batch of latent vectors to decode, sized `[batchSize, zDims]`.   *
 * @param lstmCellVars The `LayerVars` for each layer of the decoder LSTM.
 * @param zToInitStateVars The `LayerVars` for projecting from the latent
 * variable `z` to the initial states of the LSTM layers.
 * @returns An Object containing the LSTM cells and initial states.
 * @hidden
 */
function initLstmCells(z, lstmCellVars, zToInitStateVars) {
    var lstmCells = [];
    var c = [];
    var h = [];
    var initialStates = tf.split(dense(zToInitStateVars, z).tanh(), 2 * lstmCellVars.length, 1);
    var _loop_1 = function (i) {
        var lv = lstmCellVars[i];
        var forgetBias = tf.scalar(1.0);
        lstmCells.push(function (data, c, h) {
            return tf.basicLSTMCell(forgetBias, lv.kernel, lv.bias, data, c, h);
        });
        c.push(initialStates[i * 2]);
        h.push(initialStates[i * 2 + 1]);
    };
    for (var i = 0; i < lstmCellVars.length; ++i) {
        _loop_1(i);
    }
    return { 'cell': lstmCells, 'c': c, 'h': h };
}
/**
 * Abstract Decoder class.
 */
var Decoder = /** @class */ (function () {
    function Decoder() {
    }
    return Decoder;
}());
exports.Decoder = Decoder;
/**
 * Abstract base LSTM decoder that implements all functionality except sampler.
 */
var BaseDecoder = /** @class */ (function (_super) {
    __extends(BaseDecoder, _super);
    /**
     * `BaseDecoder` contructor.
     *
     * @param lstmCellVars The `LayerVars` for each layer of the decoder LSTM.
     * @param zToInitStateVars The `LayerVars` for projecting from the latent
     * variable `z` to the initial states of the LSTM layers.
     * @param outputProjectVars The `LayerVars` for projecting from the output
     * of the LSTM to the logits of the output categorical distrubtion
     * (if `nade` is null) or to bias values to use in the NADE (if `nade` is
     * not null).
     * @param nade (optional) A `Nade` to use for computing the output vectors at
     * each step. If not given, the final projection values are used as logits
     * for a categorical distribution.
     * @param controlLstmFwVars (optional) The `LayerVars` for the forward
     * direction of a bidirectional LSTM used to process the control tensors.
     * @param controlLstmBwVars (optional) The `LayerVars` for the backward
     * direction of a bidirectional LSTM used to process the control tensors.
     */
    function BaseDecoder(lstmCellVars, zToInitStateVars, outputProjectVars, outputDims, controlLstmFwVars, controlLstmBwVars) {
        var _this = _super.call(this) || this;
        _this.lstmCellVars = lstmCellVars;
        _this.zToInitStateVars = zToInitStateVars;
        _this.outputProjectVars = outputProjectVars;
        _this.zDims = _this.zToInitStateVars.kernel.shape[0];
        _this.outputDims = outputDims || outputProjectVars.bias.shape[0];
        if (controlLstmFwVars && controlLstmBwVars) {
            _this.controlBidirectionalLstm =
                new BidirectionalLstm(controlLstmFwVars, controlLstmBwVars);
        }
        return _this;
    }
    /**
     * Decodes a batch of latent vectors, `z`.
     *
     * If `nade` is parameterized, samples are generated using the MAP (argmax) of
     * the Bernoulli random variables from the NADE, and these bit vector makes up
     * the final dimension of the output.
     *
     * If `nade` is not parameterized, sample labels are generated using the
     * MAP (argmax) of the logits output by the LSTM, and the onehots of those
     * labels makes up the final dimension of the output.
     *
     * @param z A batch of latent vectors to decode, sized `[batchSize, zDims]`.
     * @param length The length of decoded sequences.
     * @param temperature (Optional) The softmax temperature to use when sampling
     * from the logits. Argmax is used if not provided.
     * @param controls (Optional) Control tensors to use for conditioning, sized
     * `[length, controlDepth]`.
     *
     * @returns A float32 tensor containing the decoded sequences, shaped
     * `[batchSize, length, depth]`.
     */
    BaseDecoder.prototype.decode = function (z, length, initialInput, temperature, controls) {
        var _this = this;
        var batchSize = z.shape[0];
        return tf.tidy(function () {
            var _a;
            // Initialize LSTMCells.
            var lstmCell = initLstmCells(z, _this.lstmCellVars, _this.zToInitStateVars);
            // Add batch dimension to controls.
            var expandedControls = controls ? tf.expandDims(controls, 0) : undefined;
            // Generate samples.
            var samples = [];
            var nextInput = initialInput ?
                initialInput :
                tf.zeros([batchSize, _this.outputDims]);
            if (_this.controlBidirectionalLstm) {
                // Preprocess the controls with a bidirectional LSTM.
                var _b = _this.controlBidirectionalLstm.process(expandedControls), fwStates = _b[0], bwStates = _b[1];
                expandedControls =
                    tf.concat([tf.stack(fwStates, 1), tf.stack(bwStates, 1)], 2);
            }
            var splitControls = expandedControls ?
                tf.split(tf.tile(expandedControls, [batchSize, 1, 1]), controls.shape[0], 1) :
                undefined;
            for (var i = 0; i < length; ++i) {
                var toConcat = splitControls ?
                    [nextInput, z, tf.squeeze(splitControls[i], [1])] :
                    [nextInput, z];
                _a = tf.multiRNNCell(lstmCell.cell, tf.concat(toConcat, 1), lstmCell.c, lstmCell.h), lstmCell.c = _a[0], lstmCell.h = _a[1];
                var lstmOutput = dense(_this.outputProjectVars, lstmCell.h[lstmCell.h.length - 1]);
                nextInput = _this.sample(lstmOutput, temperature);
                samples.push(nextInput);
            }
            return tf.stack(samples, 1);
        });
    };
    return BaseDecoder;
}(Decoder));
/**
 * Decoder that samples from a Bernoulli distributon. Unlike a NADE, each output
 * dimension is sampled independently.
 *
 * Uses a probability threshold of 0.5 if no temperature is provided.
 */
var BooleanDecoder = /** @class */ (function (_super) {
    __extends(BooleanDecoder, _super);
    function BooleanDecoder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BooleanDecoder.prototype.sample = function (lstmOutput, temperature) {
        var logits = lstmOutput;
        return (temperature ?
            tf.greaterEqual(tf.sigmoid(logits.div(tf.scalar(temperature))), tf.randomUniform(logits.shape)) :
            tf.greaterEqual(logits, 0))
            .toFloat();
    };
    return BooleanDecoder;
}(BaseDecoder));
/**
 * Decoder that samples from a Categorical distributon.
 *
 * Uses argmax if no temperature is provided.
 */
var CategoricalDecoder = /** @class */ (function (_super) {
    __extends(CategoricalDecoder, _super);
    function CategoricalDecoder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CategoricalDecoder.prototype.sample = function (lstmOutput, temperature) {
        var logits = lstmOutput;
        var timeLabels = (temperature ?
            tf.multinomial(logits.div(tf.scalar(temperature)), 1)
                .as1D() :
            logits.argMax(1).as1D());
        return tf.oneHot(timeLabels, this.outputDims).toFloat();
    };
    return CategoricalDecoder;
}(BaseDecoder));
/**
 * Decoder that samples from a NADE.
 *
 * Ignores the temperature, always selects the argmax.
 */
var NadeDecoder = /** @class */ (function (_super) {
    __extends(NadeDecoder, _super);
    function NadeDecoder(lstmCellVars, zToInitStateVars, outputProjectVars, nade, controlLstmFwVars, controlLstmBwVars) {
        var _this = _super.call(this, lstmCellVars, zToInitStateVars, outputProjectVars, nade.numDims, controlLstmFwVars, controlLstmBwVars) || this;
        _this.nade = nade;
        return _this;
    }
    NadeDecoder.prototype.sample = function (lstmOutput, temperature) {
        var _a = tf.split(lstmOutput, [this.nade.numHidden, this.nade.numDims], 1), encBias = _a[0], decBias = _a[1];
        return this.nade.sample(encBias, decBias);
    };
    return NadeDecoder;
}(BaseDecoder));
/**
 * Decoder that samples a "groove".
 *
 * Uses argmax if no temperature is provided.
 */
var GrooveDecoder = /** @class */ (function (_super) {
    __extends(GrooveDecoder, _super);
    function GrooveDecoder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GrooveDecoder.prototype.sample = function (lstmOutput, temperature) {
        var _a = tf.split(lstmOutput, 3, 1), hits = _a[0], velocities = _a[1], offsets = _a[2];
        velocities = tf.sigmoid(velocities);
        offsets = tf.tanh(offsets);
        if (temperature) {
            hits = tf.sigmoid(hits.div(tf.scalar(temperature)));
            var threshold = tf.randomUniform(hits.shape, 0, 1);
            hits = tf.greater(hits, threshold).toFloat();
        }
        else {
            hits = tf.greater(tf.sigmoid(hits), 0.5).toFloat();
        }
        return tf.concat([hits, velocities, offsets], 1);
    };
    return GrooveDecoder;
}(BaseDecoder));
/**
 * Split decoder that concatenates the outputs from its component decoders
 * depth-wise.
 */
var SplitDecoder = /** @class */ (function (_super) {
    __extends(SplitDecoder, _super);
    /**
     * `SplitDecoder` contructor.
     * @param coreDecoders Lower-level `Decoder` objects, each of which gets the
     * same `z`.
     */
    function SplitDecoder(coreDecoders) {
        var _this = _super.call(this) || this;
        _this.coreDecoders = coreDecoders;
        _this.numDecoders = _this.coreDecoders.length;
        _this.zDims = _this.coreDecoders[0].zDims;
        _this.outputDims =
            _this.coreDecoders.reduce(function (dims, dec) { return dims + dec.outputDims; }, 0);
        return _this;
    }
    SplitDecoder.prototype.decodeSeparately = function (z, length, initialInput, temperature, controls) {
        var samples = [];
        for (var i = 0; i < this.coreDecoders.length; ++i) {
            samples.push(this.coreDecoders[i].decode(z, length, initialInput[i], temperature, controls));
        }
        return samples;
    };
    /**
     * Decodes a batch of latent vectors, `z`.
     *
     * @param z A batch of latent vectors to decode, sized `[batchSize, zDims]`.
     * @param length The length of decoded sequences.
     * @param temperature (Optional) The softmax temperature to use when
     * sampling from the logits. Argmax is used if not provided.
     * @param controls (Optional) Control tensors to use for conditioning, sized
     * `[length, controlDepth]`.
     *
     * @returns A boolean tensor containing the decoded sequences, shaped
     * `[batchSize, length, depth]`.
     */
    SplitDecoder.prototype.decode = function (z, length, initialInput, temperature, controls) {
        var _this = this;
        return tf.tidy(function () {
            var samples = _this.decodeSeparately(z, length, _this.coreDecoders.map(function (_) { return initialInput; }), temperature, controls);
            return tf.concat(samples, -1);
        });
    };
    return SplitDecoder;
}(Decoder));
/**
 * Hierarchical decoder that produces intermediate embeddings to pass to
 * lower-level `Decoder` objects. The outputs from different decoders are
 * concatenated depth-wise (axis 3), and the outputs from different steps of
 * the conductor are concatenated across time (axis 1).
 */
var ConductorDecoder = /** @class */ (function (_super) {
    __extends(ConductorDecoder, _super);
    /**
     * `Decoder` contructor.
     * @param coreDecoders Lower-level `Decoder` objects to pass the conductor
     * LSTM output embeddings to for further decoding.
     * @param lstmCellVars The `LayerVars` for each layer of the conductor LSTM.
     * @param zToInitStateVars The `LayerVars` for projecting from the latent
     * variable `z` to the initial states of the conductor LSTM layers.
     * @param numSteps The number of embeddings the conductor LSTM should
     * produce and pass to the lower-level decoder.
     */
    function ConductorDecoder(coreDecoders, lstmCellVars, zToInitStateVars, numSteps) {
        var _this = _super.call(this) || this;
        _this.splitDecoder = new SplitDecoder(coreDecoders);
        _this.lstmCellVars = lstmCellVars;
        _this.zToInitStateVars = zToInitStateVars;
        _this.numSteps = numSteps;
        _this.zDims = _this.zToInitStateVars.kernel.shape[0];
        _this.outputDims = _this.splitDecoder.outputDims;
        return _this;
    }
    /**
     * Hierarchically decodes a batch of latent vectors, `z`.
     *
     * @param z A batch of latent vectors to decode, sized `[batchSize, zDims]`.
     * @param length The length of decoded sequences.
     * @param temperature (Optional) The softmax temperature to use when
     * sampling from the logits. Argmax is used if not provided.
     * @param controls (Optional) Control tensors to use for conditioning, sized
     * `[length, controlDepth]`.
     *
     * @returns A boolean tensor containing the decoded sequences, shaped
     * `[batchSize, length, depth]`.
     */
    ConductorDecoder.prototype.decode = function (z, length, initialInput, temperature, controls) {
        var _this = this;
        var batchSize = z.shape[0];
        return tf.tidy(function () {
            var _a;
            // Initialize LSTMCells.
            var lstmCell = initLstmCells(z, _this.lstmCellVars, _this.zToInitStateVars);
            // Generate embeddings.
            var samples = [];
            var initialInput = new Array(_this.splitDecoder.numDecoders).fill(undefined);
            var dummyInput = tf.zeros([batchSize, 1]);
            var splitControls = controls ? tf.split(controls, _this.numSteps) : undefined;
            for (var i = 0; i < _this.numSteps; ++i) {
                _a = tf.multiRNNCell(lstmCell.cell, dummyInput, lstmCell.c, lstmCell.h), lstmCell.c = _a[0], lstmCell.h = _a[1];
                var currSamples = _this.splitDecoder.decodeSeparately(lstmCell.h[lstmCell.h.length - 1], length / _this.numSteps, initialInput, temperature, splitControls ? splitControls[i] : undefined);
                samples.push(tf.concat(currSamples, -1));
                initialInput = currSamples.map(function (s) { return s.slice([0, s.shape[1] - 1, 0], [batchSize, 1, s.shape[s.rank - 1]])
                    .squeeze([1])
                    .toFloat(); });
            }
            return tf.concat(samples, 1);
        });
    };
    return ConductorDecoder;
}(Decoder));
/**
 * A Neural Autoregressive Distribution Estimator (NADE).
 */
var Nade = /** @class */ (function () {
    /**
     * `Nade` contructor.
     *
     * @param encWeights The encoder weights (kernel), sized
     * `[numDims, numHidden, 1]`.
     * @param decWeightsT The transposed decoder weights (kernel), sized
     * `[numDims, numHidden, 1]`.
     */
    function Nade(encWeights, decWeightsT) {
        this.numDims = encWeights.shape[0];
        this.numHidden = encWeights.shape[2];
        this.encWeights = encWeights.as2D(this.numDims, this.numHidden);
        this.decWeightsT = decWeightsT.as2D(this.numDims, this.numHidden);
    }
    /**
     * Samples from the NADE given a batch of encoder and decoder biases.
     *
     * Selects the MAP (argmax) of each Bernoulli random variable.
     *
     * @param encBias A batch of biases to use when encoding, sized
     * `[batchSize, numHidden]`.
     * @param decBias A batch of biases to use when decoding, sized
     * `[batchSize, numDims]`.
     */
    Nade.prototype.sample = function (encBias, decBias) {
        var _this = this;
        var batchSize = encBias.shape[0];
        return tf.tidy(function () {
            var samples = [];
            var a = encBias.clone();
            for (var i = 0; i < _this.numDims; i++) {
                var h = tf.sigmoid(a);
                var encWeightsI = _this.encWeights.slice([i, 0], [1, _this.numHidden]).as1D();
                var decWeightsTI = _this.decWeightsT.slice([i, 0], [1, _this.numHidden]);
                var decBiasI = decBias.slice([0, i], [batchSize, 1]);
                var contfogitsI = decBiasI.add(tf.matMul(h, decWeightsTI, false, true));
                var condProbsI = contfogitsI.sigmoid();
                var samplesI = condProbsI.greaterEqual(tf.scalar(0.5)).toFloat().as1D();
                if (i < _this.numDims - 1) {
                    a = a.add(tf.outerProduct(samplesI.toFloat(), encWeightsI));
                }
                samples.push(samplesI);
            }
            return tf.stack(samples, 1);
        });
    };
    return Nade;
}());
exports.Nade = Nade;
/**
 * Main MusicVAE model class.
 *
 * A MusicVAE is a variational autoencoder made up of an `Encoder` and
 * `Decoder`, along with a `DataConverter` for converting between `Tensor`
 * and `NoteSequence` objects for input and output.
 *
 * Exposes methods for interpolation and sampling of musical sequences.
 */
var MusicVAE = /** @class */ (function () {
    /**
     * `MusicVAE` constructor.
     *
     * @param checkpointURL Path to the checkpoint directory.
     * @param spec (Optional) `MusicVAESpec` object. If undefined, will be
     * loaded from a `config.json` file in the checkpoint directory.
     */
    function MusicVAE(checkpointURL, spec) {
        this.initialized = false;
        this.checkpointURL = checkpointURL;
        this.spec = spec;
    }
    /**
     * Instantiates data converter, attention length, chord encoder, and
     * auxiliary inputs from the `MusicVAESpec`.
     */
    MusicVAE.prototype.instantiateFromSpec = function () {
        this.dataConverter = data.converterFromSpec(this.spec.dataConverter);
        this.chordEncoder = this.spec.chordEncoder ?
            chords.chordEncoderFromType(this.spec.chordEncoder) :
            undefined;
    };
    /**
     * Disposes of any untracked `Tensors` to avoid GPU memory leaks.
     */
    MusicVAE.prototype.dispose = function () {
        var _this = this;
        if (this.rawVars !== undefined) {
            Object.keys(this.rawVars).forEach(function (name) { return _this.rawVars[name].dispose(); });
        }
        this.encoder = undefined;
        this.decoder = undefined;
        this.initialized = false;
    };
    MusicVAE.prototype.getLstmLayers = function (cellFormat, vars) {
        var lstmLayers = [];
        var l = 0;
        while (true) {
            var cellPrefix = cellFormat.replace('%d', l.toString());
            if (!(cellPrefix + 'kernel' in vars)) {
                break;
            }
            lstmLayers.push(new LayerVars(vars[cellPrefix + 'kernel'], vars[cellPrefix + 'bias']));
            ++l;
        }
        return lstmLayers;
    };
    /**
     * Loads variables from the checkpoint and instantiates the `Encoder` and
     * `Decoder`.
     */
    MusicVAE.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, LSTM_CELL_FORMAT, MUTLI_LSTM_CELL_FORMAT, CONDUCTOR_PREFIX, BIDI_LSTM_CELL, ENCODER_FORMAT, HIER_ENCODER_FORMAT, CONTROL_BIDI_LSTM_CELL, vars, encMu, fwLayers_1, bwLayers_1, baseEncoders, fwLayers, bwLayers, hasControlBidiLayers, decVarPrefix, decVarPrefixes, i, controlLstmFwLayers, controlLstmBwLayers, baseDecoders, condLstmLayers, condZtoInitState;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.dispose();
                        startTime = global_1.performance.now();
                        if (!!this.spec) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, global_1.fetch)("".concat(this.checkpointURL, "/config.json"))
                                .then(function (response) { return response.json(); })
                                .then(function (spec) {
                                if (spec.type !== 'MusicVAE') {
                                    throw new Error("Attempted to instantiate MusicVAE model with incorrect type:\n                  ".concat(spec.type));
                                }
                                _this.spec = spec;
                            })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        this.instantiateFromSpec();
                        LSTM_CELL_FORMAT = 'cell_%d/lstm_cell/';
                        MUTLI_LSTM_CELL_FORMAT = "multi_rnn_cell/".concat(LSTM_CELL_FORMAT);
                        CONDUCTOR_PREFIX = 'decoder/hierarchical_level_0/';
                        BIDI_LSTM_CELL = 'cell_%d/bidirectional_rnn/%s/multi_rnn_cell/cell_0/lstm_cell/';
                        ENCODER_FORMAT = "encoder/".concat(BIDI_LSTM_CELL);
                        HIER_ENCODER_FORMAT = "encoder/hierarchical_level_%d/".concat(BIDI_LSTM_CELL.replace('%d', '0'));
                        CONTROL_BIDI_LSTM_CELL = "control_preprocessing/".concat(BIDI_LSTM_CELL);
                        return [4 /*yield*/, (0, global_1.fetch)("".concat(this.checkpointURL, "/weights_manifest.json"))
                                .then(function (response) { return response.json(); })
                                .then(function (manifest) {
                                return tf.io.loadWeights(manifest, _this.checkpointURL);
                            })];
                    case 3:
                        vars = _a.sent();
                        this.rawVars = vars; // Save for disposal.
                        encMu = new LayerVars(vars['encoder/mu/kernel'], vars['encoder/mu/bias']);
                        if (this.dataConverter.numSegments) {
                            fwLayers_1 = this.getLstmLayers(HIER_ENCODER_FORMAT.replace('%s', 'fw'), vars);
                            bwLayers_1 = this.getLstmLayers(HIER_ENCODER_FORMAT.replace('%s', 'bw'), vars);
                            if (fwLayers_1.length !== bwLayers_1.length || fwLayers_1.length !== 2) {
                                throw Error('Only 2 hierarchical encoder levels are supported. ' +
                                    "Got ".concat(fwLayers_1.length, " forward and ").concat(bwLayers_1.length, " ") +
                                    'backward.');
                            }
                            baseEncoders = [0, 1].map(function (l) { return new BidirectionalLstmEncoder(fwLayers_1[l], bwLayers_1[l]); });
                            this.encoder = new HierarchicalEncoder(baseEncoders, [this.dataConverter.numSegments, 1], encMu);
                        }
                        else {
                            fwLayers = this.getLstmLayers(ENCODER_FORMAT.replace('%s', 'fw'), vars);
                            bwLayers = this.getLstmLayers(ENCODER_FORMAT.replace('%s', 'bw'), vars);
                            if (fwLayers.length !== bwLayers.length || fwLayers.length !== 1) {
                                throw Error('Only single-layer bidirectional encoders are supported. ' +
                                    "Got ".concat(fwLayers.length, " forward and ").concat(bwLayers.length, " ") +
                                    'backward.');
                            }
                            this.encoder =
                                new BidirectionalLstmEncoder(fwLayers[0], bwLayers[0], encMu);
                        }
                        hasControlBidiLayers = "".concat(CONTROL_BIDI_LSTM_CELL.replace('%s', 'fw')
                            .replace('%d', '0'), "kernel") in vars;
                        decVarPrefix = (this.dataConverter.numSegments) ? 'core_decoder/' : '';
                        decVarPrefixes = [];
                        if (this.dataConverter.NUM_SPLITS) {
                            for (i = 0; i < this.dataConverter.NUM_SPLITS; ++i) {
                                decVarPrefixes.push("".concat(decVarPrefix, "core_decoder_").concat(i, "/decoder/"));
                            }
                        }
                        else {
                            decVarPrefixes.push("".concat(decVarPrefix, "decoder/"));
                        }
                        controlLstmFwLayers = [null];
                        controlLstmBwLayers = [null];
                        if (hasControlBidiLayers) {
                            controlLstmFwLayers =
                                this.getLstmLayers(CONTROL_BIDI_LSTM_CELL.replace('%s', 'fw'), vars);
                            controlLstmBwLayers =
                                this.getLstmLayers(CONTROL_BIDI_LSTM_CELL.replace('%s', 'bw'), vars);
                            if (controlLstmFwLayers.length !== controlLstmBwLayers.length ||
                                controlLstmFwLayers.length !== 1) {
                                throw Error('Only single-layer bidirectional control preprocessing is ' +
                                    'supported. Got ' +
                                    "".concat(controlLstmFwLayers.length, " forward and ").concat(controlLstmBwLayers.length, " backward."));
                            }
                        }
                        baseDecoders = decVarPrefixes.map(function (varPrefix) {
                            var decLstmLayers = _this.getLstmLayers(varPrefix + MUTLI_LSTM_CELL_FORMAT, vars);
                            var decZtoInitState = new LayerVars(vars["".concat(varPrefix, "z_to_initial_state/kernel")], vars["".concat(varPrefix, "z_to_initial_state/bias")]);
                            var decOutputProjection = new LayerVars(vars["".concat(varPrefix, "output_projection/kernel")], vars["".concat(varPrefix, "output_projection/bias")]);
                            if ("".concat(varPrefix, "nade/w_enc") in vars) {
                                return new NadeDecoder(decLstmLayers, decZtoInitState, decOutputProjection, new Nade(vars["".concat(varPrefix, "nade/w_enc")], vars["".concat(varPrefix, "nade/w_dec_t")]), controlLstmFwLayers[0], controlLstmBwLayers[0]);
                            }
                            else if (_this.spec.dataConverter.type === 'GrooveConverter') {
                                return new GrooveDecoder(decLstmLayers, decZtoInitState, decOutputProjection, undefined, controlLstmFwLayers[0], controlLstmBwLayers[0]);
                            }
                            else if (_this.spec.useBooleanDecoder) {
                                return new BooleanDecoder(decLstmLayers, decZtoInitState, decOutputProjection, undefined, controlLstmFwLayers[0], controlLstmBwLayers[0]);
                            }
                            else {
                                return new CategoricalDecoder(decLstmLayers, decZtoInitState, decOutputProjection, undefined, controlLstmFwLayers[0], controlLstmBwLayers[0]);
                            }
                        });
                        // ConductorDecoder variables.
                        if (this.dataConverter.numSegments) {
                            condLstmLayers = this.getLstmLayers(CONDUCTOR_PREFIX + LSTM_CELL_FORMAT, vars);
                            condZtoInitState = new LayerVars(vars["".concat(CONDUCTOR_PREFIX, "initial_state/kernel")], vars["".concat(CONDUCTOR_PREFIX, "initial_state/bias")]);
                            this.decoder = new ConductorDecoder(baseDecoders, condLstmLayers, condZtoInitState, this.dataConverter.numSegments);
                        }
                        else if (baseDecoders.length === 1) {
                            this.decoder = baseDecoders[0];
                        }
                        else {
                            this.decoder = new SplitDecoder(baseDecoders);
                        }
                        this.zDims = this.decoder.zDims;
                        this.initialized = true;
                        logging.logWithDuration('Initialized model', startTime, 'MusicVAE');
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns true iff model is intialized.
     */
    MusicVAE.prototype.isInitialized = function () {
        return this.initialized;
    };
    /**
     * Check MusicVAEControlArgs against model configuration for compatibility.
     */
    MusicVAE.prototype.checkControlArgs = function (controlArgs) {
        controlArgs = controlArgs || {};
        var extraControls = controlArgs.extraControls || {};
        if (this.chordEncoder && !controlArgs.chordProgression) {
            throw new Error('Chord progression expected but not provided.');
        }
        if (!this.chordEncoder && controlArgs.chordProgression) {
            throw new Error('Unexpected chord progression provided.');
        }
        if (this.chordEncoder && this.dataConverter.endTensor &&
            controlArgs.chordProgression.length > 1) {
            throw new Error('Multiple chords not supported when using variable-length segments.');
        }
        if (this.spec.conditionOnKey && controlArgs.key == null) {
            throw new Error('Key expected but not provided.');
        }
        if (!this.spec.conditionOnKey && controlArgs.key != null) {
            throw new Error('Unexpected key provided.');
        }
        // Make sure all control signals from the spec are present and have the
        // correct depths.
        if (this.spec.extraControls) {
            for (var _i = 0, _a = this.spec.extraControls; _i < _a.length; _i++) {
                var controlSpec = _a[_i];
                if (controlSpec.name in extraControls) {
                    if (extraControls[controlSpec.name].shape[1] !== controlSpec.depth) {
                        throw new Error("Control signal ".concat(controlSpec.name, " has invalid depth: ").concat(extraControls[controlSpec.name].shape[1], " != ").concat(controlSpec.depth));
                    }
                }
                else {
                    throw new Error("Missing control signal: ".concat(controlSpec.name));
                }
            }
        }
        // Warn about any extraneous control signals.
        var controlNames = this.spec.extraControls ?
            new Set(this.spec.extraControls.map(function (controlSpec) { return controlSpec.name; })) :
            new Set();
        for (var name_1 in extraControls) {
            if (!controlNames.has(name_1)) {
                logging.log("Unspecified control signal provided: ".concat(name_1), 'MusicVAE', 5 /* logging.Level.WARN */);
            }
        }
    };
    /**
     * Convert MusicVAEControlArgs to `Tensor` (`numSteps`-by-`controlDepth`) to
     * use as conditioning.
     */
    MusicVAE.prototype.controlArgsToTensor = function (controlArgs) {
        var _this = this;
        controlArgs = controlArgs || {};
        return tf.tidy(function () {
            var controls = [];
            if (controlArgs.chordProgression) {
                var encodedChords = _this.encodeChordProgression(controlArgs.chordProgression);
                controls.push(encodedChords);
            }
            if (controlArgs.key != null) {
                var encodedKey = tf.oneHot(tf.fill([_this.dataConverter.numSteps], controlArgs.key, 'int32'), 12);
                controls.push(encodedKey);
            }
            if (controlArgs.extraControls) {
                for (var _i = 0, _a = _this.spec.extraControls; _i < _a.length; _i++) {
                    var controlSpec = _a[_i];
                    controls.push(controlArgs.extraControls[controlSpec.name]);
                }
            }
            // Concatenate controls depthwise.
            return controls.length ? tf.concat2d(controls, 1) : undefined;
        });
    };
    /**
     * Interpolates between the input `Tensor`s in latent space.
     *
     * If 2 sequences are given, a single linear interpolation is computed,
     * with the first output sequence being a reconstruction of sequence A and
     * the final output being a reconstruction of sequence B, with
     * `numInterps` total sequences.
     *
     * If 4 sequences are given, bilinear interpolation is used. The results
     * are returned in row-major order for a matrix with the following layout:
     *   | A . . C |
     *   | . . . . |
     *   | . . . . |
     *   | B . . D |
     * where the letters represent the reconstructions of the four inputs, in
     * alphabetical order, with the number of output columns and rows specified
     * by `numInterps`.
     *
     * @param inputTensors A 3D `Tensor` containing 2 or 4 sequences to
     * interpolate between.
     * @param numInterps The number of pairwise interpolation sequences to
     * return, including the reconstructions. If 4 inputs are given, this can be
     * either a single number specifying the side length of a square, or a
     * `[columnCount, rowCount]` array to specify a rectangle.
     * @param temperature (Optional) The softmax temperature to use when
     * sampling from the logits. Argmax is used if not provided.
     * @param controlArgs (Optional) MusicVAEControlArgs object to use as
     * conditioning.
     *
     * @returns A 3D `Tensor` of interpolations.
     */
    MusicVAE.prototype.interpolateTensors = function (inputTensors, numInterps, temperature, controlArgs) {
        return __awaiter(this, void 0, void 0, function () {
            var inputZs, interpZs, outputTensors;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.initialized) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.initialize()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.encodeTensors(inputTensors, controlArgs)];
                    case 3:
                        inputZs = _a.sent();
                        interpZs = tf.tidy(function () { return _this.getInterpolatedZs(inputZs, numInterps); });
                        inputZs.dispose();
                        return [4 /*yield*/, this.decodeTensors(interpZs, temperature, controlArgs)];
                    case 4:
                        outputTensors = _a.sent();
                        interpZs.dispose();
                        return [2 /*return*/, outputTensors];
                }
            });
        });
    };
    /**
     * Interpolates between the input `NoteSequence`s in latent space.
     *
     * If 2 sequences are given, a single linear interpolation is computed,
     * with the first output sequence being a reconstruction of sequence A and
     * the final output being a reconstruction of sequence B, with
     * `numInterps` total sequences.
     *
     * If 4 sequences are given, bilinear interpolation is used. The results
     * are returned in row-major order for a matrix with the following layout:
     *   | A . . C |
     *   | . . . . |
     *   | . . . . |
     *   | B . . D |
     * where the letters represent the reconstructions of the four inputs, in
     * alphabetical order, with the number of output columns and rows specified
     * by `numInterps`.
     *
     * @param inputSequences An array of 2 or 4 `NoteSequence`s to interpolate
     * between.
     * @param numInterps The number of pairwise interpolation sequences to
     * return, including the reconstructions. If 4 inputs are given, this can be
     * either a single number specifying the side length of a square, or a
     * `[columnCount, rowCount]` array to specify a rectangle.
     * @param temperature (Optional) The softmax temperature to use when
     * sampling from the logits. Argmax is used if not provided.
     * @param controlArgs (Optional) MusicVAEControlArgs object to use as
     * conditioning.
     *
     * @returns An array of interpolation `NoteSequence` objects, as described
     * above.
     */
    MusicVAE.prototype.interpolate = function (inputSequences, numInterps, temperature, controlArgs) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, inputZs, interpZs, outputSequences;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.checkControlArgs(controlArgs);
                        if (!!this.initialized) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.initialize()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        startTime = 0;
                        return [4 /*yield*/, this.encode(inputSequences, controlArgs)];
                    case 3:
                        inputZs = _a.sent();
                        interpZs = tf.tidy(function () { return _this.getInterpolatedZs(inputZs, numInterps); });
                        inputZs.dispose();
                        outputSequences = this.decode(interpZs, temperature, controlArgs);
                        interpZs.dispose();
                        outputSequences.then(function () { return logging.logWithDuration('Interpolation completed', startTime, 'MusicVAE', 20 /* logging.Level.DEBUG */); });
                        return [2 /*return*/, outputSequences];
                }
            });
        });
    };
    /**
     * Get segment lengths for variable-length segments.
     */
    MusicVAE.prototype.getSegmentLengths = function (inputTensors) {
        return __awaiter(this, void 0, void 0, function () {
            var numSteps, numSegments, isEndTensor, isEndArray, maxSegmentLength, segmentLengths, offset, fromIndex;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (inputTensors.shape[0] > 1) {
                            throw new Error('Variable-length segments not supported for batch size > 1.');
                        }
                        numSteps = this.dataConverter.numSteps;
                        numSegments = this.dataConverter.numSegments;
                        isEndTensor = tf.tidy(function () { return tf.min(tf.equal(inputTensors.squeeze([0]), _this.dataConverter.endTensor.expandDims(0)), 1); });
                        return [4 /*yield*/, isEndTensor.data()];
                    case 1:
                        isEndArray = _a.sent();
                        isEndTensor.dispose();
                        maxSegmentLength = numSteps / numSegments;
                        segmentLengths = [];
                        offset = 0;
                        fromIndex = isEndArray.indexOf(1);
                        while (fromIndex !== -1) {
                            segmentLengths.push(fromIndex - offset + 1);
                            offset += maxSegmentLength;
                            fromIndex = isEndArray.indexOf(1, offset);
                        }
                        if (segmentLengths.length !== numSegments) {
                            throw new Error("Incorrect number of segments: ".concat(segmentLengths.length, " != ").concat(numSegments));
                        }
                        return [2 /*return*/, segmentLengths];
                }
            });
        });
    };
    /**
     * Construct the chord-conditioning tensors. For models where each segment
     * is a separate track, the same chords should be used for each segment.
     * Additionally, "no-chord" should be used for the first step (the
     * instrument- select / skip-track step).
     */
    MusicVAE.prototype.encodeChordProgression = function (chordProgression) {
        var numSteps = this.dataConverter.numSteps;
        var numSegments = this.dataConverter.numSegments;
        var numChordSteps = this.dataConverter.SEGMENTED_BY_TRACK ?
            numSteps / numSegments :
            numSteps;
        var encodedChordProgression = this.dataConverter.SEGMENTED_BY_TRACK ?
            tf.concat2d([
                this.chordEncoder.encode(constants.NO_CHORD)
                    .expandDims(0),
                this.chordEncoder.encodeProgression(chordProgression, numChordSteps - 1)
            ], 0) :
            this.chordEncoder.encodeProgression(chordProgression, numChordSteps);
        return this.dataConverter.SEGMENTED_BY_TRACK ?
            tf.tile(encodedChordProgression, [numSegments, 1]) :
            encodedChordProgression;
    };
    /**
     * Encodes the input `Tensor`s into latent vectors.
     *
     * @param inputTensors A 3D `Tensor` of sequences to encode.
     * @param controlArgs (Optional) MusicVAEControlArgs object to use as
     * conditioning.
     * @returns A `Tensor` containing the batch of latent vectors, sized
     * `[inputTensors.shape[0], zSize]`.
     */
    MusicVAE.prototype.encodeTensors = function (inputTensors, controlArgs) {
        return __awaiter(this, void 0, void 0, function () {
            var segmentLengths, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.checkControlArgs(controlArgs);
                        if (!!this.initialized) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.initialize()];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        if (!this.dataConverter.endTensor) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.getSegmentLengths(inputTensors)];
                    case 3:
                        _a = _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        _a = undefined;
                        _b.label = 5;
                    case 5:
                        segmentLengths = _a;
                        return [2 /*return*/, tf.tidy(function () {
                                var controlTensor = _this.controlArgsToTensor(controlArgs);
                                // Stack input tensors and control tensor (with batch dimension added)
                                // depthwise.
                                var inputsAndControls = [inputTensors];
                                if (controlTensor) {
                                    var tiles = tf.tile(tf.expandDims(controlTensor, 0), [inputTensors.shape[0], 1, 1]);
                                    inputsAndControls.push(tiles);
                                }
                                var inputTensorsWithControls = tf.concat3d(inputsAndControls, 2);
                                // Use the mean `mu` of the latent variable as the best estimate of `z`.
                                return _this.encoder.encode(inputTensorsWithControls, segmentLengths);
                            })];
                }
            });
        });
    };
    /**
     * Encodes the input `NoteSequence`s into latent vectors.
     *
     * @param inputSequences An array of `NoteSequence`s to encode.
     * @param controlArgs (Optional) MusicVAEControlArgs object to use as
     * conditioning.
     *
     * @returns A `Tensor` containing the batch of latent vectors, sized
     * `[inputSequences.length, zSize]`.
     */
    MusicVAE.prototype.encode = function (inputSequences, controlArgs) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, inputTensors, z;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.initialized) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.initialize()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        startTime = global_1.performance.now();
                        inputTensors = tf.tidy(function () { return tf.stack(inputSequences.map(function (t) { return _this.dataConverter.toTensor(t); })); });
                        return [4 /*yield*/, this.encodeTensors(inputTensors, controlArgs)];
                    case 3:
                        z = _a.sent();
                        inputTensors.dispose();
                        logging.logWithDuration('Encoding completed', startTime, 'MusicVAE', 20 /* logging.Level.DEBUG */);
                        return [2 /*return*/, z];
                }
            });
        });
    };
    /**
     * Decodes the input latent vectors into tensors.
     *
     * @param z The latent vectors to decode, sized `[batchSize, zSize]`.
     * @param temperature (Optional) The softmax temperature to use when
     * sampling. The argmax is used if not provided.
     * @param controlArgs (Optional) MusicVAEControlArgs object to use as
     * conditioning.
     *
     * @returns The decoded tensors.
     */
    MusicVAE.prototype.decodeTensors = function (z, temperature, controlArgs) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.checkControlArgs(controlArgs);
                        if (!!this.initialized) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.initialize()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, tf.tidy(function () {
                            var controlTensor = _this.controlArgsToTensor(controlArgs);
                            return _this.decoder.decode(z, _this.dataConverter.numSteps, undefined, temperature, controlTensor);
                        })];
                }
            });
        });
    };
    /**
     * Decodes the input latent vectors into `NoteSequence`s.
     *
     * @param z The latent vectors to decode, sized `[batchSize, zSize]`.
     * @param temperature (Optional) The softmax temperature to use when
     * sampling. The argmax is used if not provided.
     * @param controlArgs (Optional) MusicVAEControlArgs object to use as
     * conditioning.
     * @param stepsPerQuarter The step resolution of the resulting
     * `NoteSequence`.
     * @param qpm The tempo of the resulting `NoteSequence`s.
     *
     * @returns The decoded `NoteSequence`s.
     */
    MusicVAE.prototype.decode = function (z_1, temperature_1, controlArgs_1) {
        return __awaiter(this, arguments, void 0, function (z, temperature, controlArgs, stepsPerQuarter, qpm) {
            var startTime, tensors, ohSeqs, outputSequences, _i, ohSeqs_1, oh, _a, _b;
            if (stepsPerQuarter === void 0) { stepsPerQuarter = constants.DEFAULT_STEPS_PER_QUARTER; }
            if (qpm === void 0) { qpm = constants.DEFAULT_QUARTERS_PER_MINUTE; }
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!!this.initialized) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.initialize()];
                    case 1:
                        _c.sent();
                        _c.label = 2;
                    case 2:
                        startTime = global_1.performance.now();
                        return [4 /*yield*/, this.decodeTensors(z, temperature, controlArgs)];
                    case 3:
                        tensors = _c.sent();
                        ohSeqs = tf.tidy(function () {
                            return tf.split(tensors, tensors.shape[0])
                                .map(function (oh) { return oh.squeeze([0]); });
                        });
                        outputSequences = [];
                        _i = 0, ohSeqs_1 = ohSeqs;
                        _c.label = 4;
                    case 4:
                        if (!(_i < ohSeqs_1.length)) return [3 /*break*/, 7];
                        oh = ohSeqs_1[_i];
                        _b = (_a = outputSequences).push;
                        return [4 /*yield*/, this.dataConverter.toNoteSequence(oh, stepsPerQuarter, qpm)];
                    case 5:
                        _b.apply(_a, [_c.sent()]);
                        oh.dispose();
                        _c.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7:
                        tensors.dispose();
                        logging.logWithDuration('Decoding completed', startTime, 'MusicVAE', 20 /* logging.Level.DEBUG */);
                        return [2 /*return*/, outputSequences];
                }
            });
        });
    };
    MusicVAE.prototype.getInterpolatedZs = function (z, numInterps) {
        if (typeof numInterps === 'number') {
            numInterps = [numInterps];
        }
        if (z.shape[0] !== 2 && z.shape[0] !== 4) {
            throw new Error('Invalid number of input sequences. Requires length 2, or 4');
        }
        if (numInterps.length !== 1 && numInterps.length !== 2) {
            throw new Error('Invalid number of dimensions. Requires length 1, or 2.');
        }
        var w = numInterps[0];
        var h = numInterps.length === 2 ? numInterps[1] : w;
        // Compute the interpolations of the latent variable.
        var interpolatedZs = tf.tidy(function () {
            var rangeX = tf.linspace(0.0, 1.0, w);
            var z0 = z.slice([0, 0], [1, z.shape[1]]).as1D();
            var z1 = z.slice([1, 0], [1, z.shape[1]]).as1D();
            if (z.shape[0] === 2) {
                var zDiff = z1.sub(z0);
                return tf.outerProduct(rangeX, zDiff).add(z0);
            }
            else if (z.shape[0] === 4) {
                var rangeY = tf.linspace(0.0, 1.0, h);
                var z2 = z.slice([2, 0], [1, z.shape[1]]).as1D();
                var z3 = z.slice([3, 0], [1, z.shape[1]]).as1D();
                var revRangeX = tf.scalar(1.0).sub(rangeX);
                var revRangeY = tf.scalar(1.0).sub(rangeY);
                var finalZs = z0.mul(tf.outerProduct(revRangeY, revRangeX).as3D(h, w, 1));
                finalZs = tf.addStrict(finalZs, z1.mul(tf.outerProduct(rangeY, revRangeX).as3D(h, w, 1)));
                finalZs = tf.addStrict(finalZs, z2.mul(tf.outerProduct(revRangeY, rangeX).as3D(h, w, 1)));
                finalZs = tf.addStrict(finalZs, z3.mul(tf.outerProduct(rangeY, rangeX).as3D(h, w, 1)));
                return finalZs.as2D(w * h, z.shape[1]);
            }
            else {
                throw new Error('Invalid number of note sequences. Requires length 2, or 4');
            }
        });
        return interpolatedZs;
    };
    /**
     * Samples tensors from the model prior.
     *
     * @param numSamples The number of samples to return.
     * @param temperature The softmax temperature to use when sampling.
     * @param controlArgs (Optional) MusicVAEControlArgs object to use as
     * conditioning.
     *
     * @returns A `Tensor3D` of samples.
     */
    MusicVAE.prototype.sampleTensors = function (numSamples_1) {
        return __awaiter(this, arguments, void 0, function (numSamples, temperature, controlArgs) {
            var randZs, outputTensors;
            var _this = this;
            if (temperature === void 0) { temperature = 0.5; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.checkControlArgs(controlArgs);
                        if (!!this.initialized) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.initialize()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        randZs = tf.tidy(function () { return tf.randomNormal([numSamples, _this.decoder.zDims]); });
                        return [4 /*yield*/, this.decodeTensors(randZs, temperature, controlArgs)];
                    case 3:
                        outputTensors = _a.sent();
                        randZs.dispose();
                        return [2 /*return*/, outputTensors];
                }
            });
        });
    };
    /**
     * Samples sequences from the model prior.
     *
     * @param numSamples The number of samples to return.
     * @param temperature The softmax temperature to use when sampling.
     * @param controlArgs (Optional) MusicVAEControlArgs object to use as
     * conditioning.
     * @param stepsPerQuarter The step resolution of the resulting
     * `NoteSequence`s.
     * @param qpm The tempo of the resulting `NoteSequence`s.
     *
     * @returns An array of sampled `NoteSequence` objects.
     */
    MusicVAE.prototype.sample = function (numSamples_1) {
        return __awaiter(this, arguments, void 0, function (numSamples, temperature, controlArgs, stepsPerQuarter, qpm) {
            var startTime, randZs, outputSequences;
            var _this = this;
            if (temperature === void 0) { temperature = 0.5; }
            if (stepsPerQuarter === void 0) { stepsPerQuarter = constants.DEFAULT_STEPS_PER_QUARTER; }
            if (qpm === void 0) { qpm = constants.DEFAULT_QUARTERS_PER_MINUTE; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.checkControlArgs(controlArgs);
                        if (!!this.initialized) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.initialize()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        startTime = global_1.performance.now();
                        randZs = tf.tidy(function () { return tf.randomNormal([numSamples, _this.decoder.zDims]); });
                        outputSequences = this.decode(randZs, temperature, controlArgs, stepsPerQuarter, qpm);
                        randZs.dispose();
                        outputSequences.then(function () { return logging.logWithDuration('Sampling completed', startTime, 'MusicVAE', 20 /* logging.Level.DEBUG */); });
                        return [2 /*return*/, outputSequences];
                }
            });
        });
    };
    /**
     * Generates similar tensors to an input tensor.
     *
     * This is done by sampling new Zs from a unit Gaussian and interpolating
     * between the encoded input tensor and the sampled Zs.
     *
     * @param inputTensor The input tensor, a `Tensor2D`.
     * @param numSamples The number of samples to return.
     * @param similarity The degree of similarity between the generated tensors
     * and the input tensor. Must be between 0 and 1, where 1 is most similar and
     * 0 is least similar.
     * @param temperature The softmax temperature to use when sampling.
     * @param controlArgs (Optional) MusicVAEControlArgs object to use as
     * conditioning.
     *
     * @returns A `Tensor3D` of samples.
     */
    MusicVAE.prototype.similarTensors = function (inputTensor, numSamples, similarity, temperature, controlArgs) {
        return __awaiter(this, void 0, void 0, function () {
            var inputTensors, inputZs, similarZs, outputTensors;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (similarity < 0 || similarity > 1) {
                            throw new Error('Similarity must be between 0 and 1.');
                        }
                        if (!!this.initialized) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.initialize()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        inputTensors = tf.expandDims(inputTensor, 0);
                        return [4 /*yield*/, this.encodeTensors(inputTensors, controlArgs)];
                    case 3:
                        inputZs = _a.sent();
                        inputTensors.dispose();
                        similarZs = tf.tidy(function () {
                            var randZs = tf.randomNormal([numSamples, _this.decoder.zDims]);
                            // TODO(iansimon): use slerp instead of linear interpolation
                            return tf.add(inputZs.mul(similarity), randZs.mul(1 - similarity));
                        });
                        inputZs.dispose();
                        return [4 /*yield*/, this.decodeTensors(similarZs, temperature, controlArgs)];
                    case 4:
                        outputTensors = _a.sent();
                        similarZs.dispose();
                        return [2 /*return*/, outputTensors];
                }
            });
        });
    };
    /**
     * Generates similar `NoteSequence`s to an input `NoteSequence`.
     *
     * This is done by sampling new Zs from a unit Gaussian and interpolating
     * between the encoded input `NoteSequence` and the sampled Zs.
     *
     * @param inputSequence The input `NoteSequence`.
     * @param numSamples The number of samples to return.
     * @param similarity The degree of similarity between the generated sequences
     * and the input sequence. Must be between 0 and 1, where 1 is most similar
     * and 0 is least similar.
     * @param temperature The softmax temperature to use when sampling.
     * @param controlArgs (Optional) MusicVAEControlArgs object to use as
     * conditioning.
     *
     * @returns An array of generated `NoteSequence` objects.
     */
    MusicVAE.prototype.similar = function (inputSequence, numSamples, similarity, temperature, controlArgs) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, inputZs, similarZs, outputSequences;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.checkControlArgs(controlArgs);
                        if (similarity < 0 || similarity > 1) {
                            throw new Error('Similarity must be between 0 and 1.');
                        }
                        if (!!this.initialized) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.initialize()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        startTime = 0;
                        return [4 /*yield*/, this.encode([inputSequence], controlArgs)];
                    case 3:
                        inputZs = _a.sent();
                        similarZs = tf.tidy(function () {
                            var randZs = tf.randomNormal([numSamples, _this.decoder.zDims]);
                            // TODO(iansimon): use slerp instead of linear interpolation
                            return tf.add(inputZs.mul(similarity), randZs.mul(1 - similarity));
                        });
                        inputZs.dispose();
                        outputSequences = this.decode(similarZs, temperature, controlArgs);
                        similarZs.dispose();
                        outputSequences.then(function () { return logging.logWithDuration('Similar sequence generation completed', startTime, 'MusicVAE', 20 /* logging.Level.DEBUG */); });
                        return [2 /*return*/, outputSequences];
                }
            });
        });
    };
    return MusicVAE;
}());
exports.MusicVAE = MusicVAE;
