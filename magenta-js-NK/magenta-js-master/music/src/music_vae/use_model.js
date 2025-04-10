"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Call_Music = Call_Music;
exports.Mel_prompt = Mel_prompt;
exports.store_Mel = store_Mel;
exports.retrieve_Mel = retrieve_Mel;
exports.start_Mel = start_Mel;
exports.time_Mel = time_Mel;
exports.stop_Mel = stop_Mel;
//Psuedocode for new code to ensure the user can choose and create their own music
//This is based on the usercase workflow chart I created to ensure that what I made is functional
import { MusicVAE } from './model';
import { Melody } from '../core/melodies';

let currentMel = null;
//TODO: Make a page that has a function that can call any melody from the code.

function Call_Music(input) {
    console.log("Calls the melody from the function", input);
    currentMel = input;
}
//TODO: Once this is done, create a prompt function such that the user can call get the melody from the function such that the user can run the melody
function Mel_prompt(input) {
    console.log("Gets the melody from prompt", input);
    currentMel = input;
}
//TODO: Once the user types the prompt, there needs to be a function such that it stores the components of a melody. This should be a seperate page 
//such that the page contains a module which will consist of functions which will take from functions that provide the melodies, and then create a 
//function that stores the melody
function store_Mel() {
    if (currentMel) {
        const StoreTheMel = JSON.stringify(Melody);
        localStorage.setItem("Melody_stored", StoreTheMel);
        console.log("Melody_stored", StoreTheMel);
    }
    else {
        console.log("Melody is unable to be stored");
    }
}
//TODO: After the function is stored and the melody is prompted, the code should go through the page, and take the melody from the store module to the start function
//Which will be on a different page or module
function retrieve_Mel() {
    const Mel_stored = localStorage.getItem("Melody_stored");
    if(Mel_stored){
        const errorMel = JSON.parse(Mel_stored);
        currentMel = errorMel;
        console.log("Get the Melody", errorMel);
        return errorMel;
    } else { 
        return null;
    }
}
//TODO: Once the melody enters the start function located on a new page or module, the function will start the new melody prompted by the user
async function start_Mel() {
    const NewMel = retrieve_Mel();
    if(NewMel) {
        try{
            await MusicVAE.apply(currentMel);
            await Melody.apply(currentMel);

        }
        catch{
            console.log("Melody has not started");
        }
    };
}
//TODO: After the melody starts, the melody will play for a specific time. There needs to be a function that will determine how long the melody will play when the function is executed
function time_Mel(duration) {
    console.log(`Melody will play for: ${duration} seconds`);
    setTimeout(function () {
        console.log("The melody has ended");
        stop_Mel();
    }, duration * 1000);
    //This function will be used to stop the time as provided by the user
}
//TODO: Finally, the function will have an end condition which is when the melody will stop playing. 
function stop_Mel() {
    console.log("Melody has ended");
}
