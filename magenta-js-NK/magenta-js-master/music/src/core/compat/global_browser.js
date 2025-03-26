"use strict";
/**
 * A module containing a metronome based on Tone.js. The timing is done
 * using the underlying WebAudio clock, so it is accurate, and the metronome
 * fires callbacks for every audible click, quarter and bar marks.
 *
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSafari = exports.navigator = exports.performance = exports.fetch = void 0;
exports.getOfflineAudioContext = getOfflineAudioContext;
/**
 * Attempts to determine which global object to use, depending on whether or
 * note the script is being used in a browser, web worker, or other context.
 */
function getGlobalObject() {
    // tslint:disable-next-line:max-line-length
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis
    if (typeof globalThis !== 'undefined') {
        return globalThis;
    }
    if (typeof self !== 'undefined') {
        return self;
    }
    if (typeof window !== 'undefined') {
        return window;
    }
    if (typeof global !== 'undefined') {
        return global;
    }
    throw new Error('cannot find the global object');
}
var globalObject = getGlobalObject();
exports.fetch = globalObject.fetch.bind(globalObject);
exports.performance = globalObject.performance;
exports.navigator = globalObject.navigator;
// tslint:disable:no-any
exports.isSafari = !!globalObject.webkitOfflineAudioContext;
// tslint:disable-next-line:no-any variable-name
var isWorker = typeof globalObject.WorkerGlobalScope !== 'undefined';
function getOfflineAudioContext(sampleRate) {
    // Safari Webkit only supports 44.1kHz audio.
    var WEBKIT_SAMPLE_RATE = 44100;
    sampleRate = exports.isSafari ? WEBKIT_SAMPLE_RATE : sampleRate;
    if (isWorker) {
        throw new Error('Cannot use offline audio context in a web worker.');
    }
    // tslint:disable-next-line:no-any variable-name
    var SafariOfflineCtx = globalObject.webkitOfflineAudioContext;
    return exports.isSafari ? new SafariOfflineCtx(1, sampleRate, sampleRate) :
        new globalObject.OfflineAudioContext(1, sampleRate, sampleRate);
}
