//Psuedocode for new code to ensure the user can choose and create their own music
//This is based on the usercase workflow chart I created to ensure that what I made is functional
import {MusicVAE} from './model';
import promptsync from 'prompt-sync';
import { Melody } from '../core/melodies';


//TODO: the user must be able to type a melody prompt
const prompt = promptsync(MusicVAE);
const input: string = prompt(MusicVAE); //This will be used to call the melody prompt

//TODO: Make a page that has a function that can call any melody from the code.
function Call_Music(){
    console.log("Calls the melody from the function");
}


//TODO: Once this is done, create a prompt function such that the user can call get the melody from the function such that the user can run the melody
function Mel_prompt(){
    prompt(Melody)
}

//TODO: Once the user types the prompt, there needs to be a function such that it stores the components of a melody. This should be a seperate page 
//such that the page contains a module which will consist of functions which will take from functions that provide the melodies, and then create a 
//function that stores the melody

function store_Mel(){
    Call_Music.toString();
    localStorage.setItem(MusicVAE.toString(), JSON.stringify('Melody'));
}


//TODO: After the function is stored and the melody is prompted, the code should go through the page, and take the melody from the store module to the start function
//Which will be on a different page or module
function retrieve_Mel(){
    const Melody = localStorage.getItem(MusicVAE.toString());
}


//TODO: Once the melody enters the start function located on a new page or module, the function will start the new melody prompted by the user
function start_Mel(){
    let Melody = performance.now();
}

//TODO: After the melody starts, the melody will play for a specific time. There needs to be a function that will determine how long the melody will play when the function is executed
function time_Mel(){

    Melody.call(console.log("Did the code stop?", 1000));
    Melody.call(console.log("Did the code stop?", 5000));
    Melody.call(console.log("Did the code stop?", 10000));
    //This function will be used to stop the time as provided by the user
}


//TODO: Finally, the function will have an end condition which is when the melody will stop playing. 
function stop_Mel(){
    /*Melody.peformance(() => {
        setTimeout
    }, 1000);*/
}
