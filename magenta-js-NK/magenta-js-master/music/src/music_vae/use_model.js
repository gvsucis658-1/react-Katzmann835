"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Psuedocode for new code to ensure the user can choose and create their own music
//This is based on the usercase workflow chart I created to ensure that what I made is functional
import {MusicVAE} from "./model";
import promptSync from "prompt-sync";
import Melody from "../core/melodies";
//TODO: the user must be able to type a melody prompt
const prompt = promptSync();
let input = prompt("Type a Melody prompt: "); //This will be used to call the melody prompt
//TODO: Make a page that has a function that can call any melody from the code.
function Call_Music() {
    console.log(MusicVAE);
}
//TODO: Once this is done, create a prompt function such that the user can call get the melody from the function such that the user can run the melody
function Mel_prompt() {
    ChosenPrompt = input(Melody);
    console.log(`Melody '${ChosenPrompt}' has been chosen and ready to be prompted`)
}
//TODO: Once the user types the prompt, there needs to be a function such that it stores the components of a melody. This should be a seperate page 
//such that the page contains a module which will consist of functions which will take from functions that provide the melodies, and then create a 
//function that stores the melody
function store_Mel() {
    const melData = JSON.stringify(Melody);
    localStorage.setItem('StoredMelody', melData);
    console.log("Melody has been stored")
}
//TODO: After the function is stored and the melody is prompted, the code should go through the page, and take the melody from the store module to the start function
//Which will be on a different page or module
function retrieve_Mel() {
    const melodyStored = localStorage.getItem('StoredMelody');
    if (melodyStored){
        const melody = JSON.parse(melodyStored);
        console.log("Melody has been retrieved from storage");
        return melody;
    }
    Melody("Melody failed to retrieve the melody");
    return null;
}
//TODO: Once the melody enters the start function located on a new page or module, the function will start the new melody prompted by the user
function start_Mel() {
    var Melody = retrieve_Mel();
    if (Melody){
        Melody.start();
        console.log("Melody has started")
    } else {
        console.log("No Melody has been started")
    }
}
//TODO: After the melody starts, the melody will play for a specific time. There needs to be a function that will determine how long the melody will play when the function is executed
function time_Mel() {

    setTimeout(() => {
        console.log("Did the code stop?", 1000)
        console.log("Did the code stop?", 5000);
        console.log("Did the code stop?", 10000);
    })
    //This function will be used to stop the time as provided by the user
}
//TODO: Finally, the function will have an end condition which is when the melody will stop playing. 
function stop_Mel() {
    setTimeout(() => {
        console.log("Melody has stopped");
        const stopMel = retrieve_Mel();
        if (stopMel && stopMel.stop) {
            stopMel.stop();
        }
    }, 1000);
}
console.log(stop_Mel);