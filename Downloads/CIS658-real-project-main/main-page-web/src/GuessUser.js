import {useState} from 'react';
import Main from './Main.js';
import Comments from './Comments.js';
import {ToastContainer, toast} from 'react-toastify';


//Psuedocode for the Guess Button:

function GuessUser(){

//TODO: the code must choose a picture, or a post that was posted by the user

//TODO: Once clicked, the picture or post will have the css background color that will make the text or picture dissappear

//TODO: The background color for the should be a dark color to obstruct the comment or picture view such as: 
//Black, Brown, Grey, Maroon, Purple, etc...

    const newObject = ()  => {
        const newStyle = {
            color: "black",
            backgroundColor: "black",
        };

        return (
            <>
            <p>This button will eventually change the Image/Comment to this style:</p>
            <button style = {newStyle}>Change Image/Comment</button>
            </>
        )
    }
}

//The new background color obstructing the image/comment is clickable by the user, which will reveal a Notification if they want to friend or promote the user

//The User can accept or the user can decline

export default GuessUser;

