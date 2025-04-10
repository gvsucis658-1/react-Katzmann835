//Psuedocode for new code to ensure the user can choose and create their own music
//This is based on the usercase workflow chart I created to ensure that what I made is functional
import { MusicVAE } from './model';
import { Melody } from '../core/melodies';

let currentMel: string | null = null;

//TODO: Make a page that has a function that can call any melody from the code.
export function Call_Music(input: string): void{
    console.log("Calls the melody from the function", input);
    currentMel = input;
}


//TODO: Once this is done, create a prompt function such that the user can call get the melody from the function such that the user can run the melody
export function Mel_prompt(input: string): void{
    console.log("Gets the melody from prompt", input);
    currentMel = input;
}

//TODO: Once the user types the prompt, there needs to be a function such that it stores the components of a melody. This should be a seperate page 
//such that the page contains a module which will consist of functions which will take from functions that provide the melodies, and then create a 
//function that stores the melody

export function store_Mel(): void{
    if(currentMel){
        localStorage.setItem("Melody_stored", currentMel);
        console.log("Melody_stored", currentMel);
    } else {
        console.log("Melody is unable to be stored");
    }
}


//TODO: After the function is stored and the melody is prompted, the code should go through the page, and take the melody from the store module to the start function
//Which will be on a different page or module
export function retrieve_Mel(): string | null {
    const Mel_stored = localStorage.getItem("Melody_stored");
    console.log("Get_Melody", Mel_stored);
    currentMel = Mel_stored;
    return Mel_stored;
}


//TODO: Once the melody enters the start function located on a new page or module, the function will start the new melody prompted by the user
export function start_Mel(){
    if (currentMel) {
    const NewMel = performance.now();
    MusicVAE.apply(currentMel);
    Melody.apply(currentMel);
    } else {
        console.log("No Melody has been played")
    }
}

//TODO: After the melody starts, the melody will play for a specific time. There needs to be a function that will determine how long the melody will play when the function is executed
export function time_Mel(duration: number){
    if (duration <= 0){
        console.log("Melody should not play since melody cannot be 0 or less")
        return;
    }

    console.log(`Melody will play for:${duration} seconds`);

    setTimeout(() => {
        console.log("The melody has ended");
        stop_Mel();
    }, duration * 1000);
    //This function will be used to stop the time as provided by the user
}


//TODO: Finally, the function will have an end condition which is when the melody will stop playing. 
export function stop_Mel(){
    console.log ("Melody has ended");
}
