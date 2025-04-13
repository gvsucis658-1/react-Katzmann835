import {useState} from 'react';
import Main from './Main.js';
import Comments from './Comments.js';
import {ToastContainer, toast} from 'react-toastify';


//Psuedocode for the Guess Button:

function GuessUser(){

//TODO: the code must choose a picture, or a post that was posted by the user
    const chooseType = () => {
        chosenImage = Main.call('Image has been Retrieved').uploadedImageURL
        chosenComment = Comments.call('Comment has been Retrieved').setcommenttext
    }

//TODO: Once clicked, the picture or post will have the css background color that will make the text or picture dissappear

//TODO: The background color for the should be a dark color to obstruct the comment or picture view such as: 
//Black, Brown, Grey, Maroon, Purple, etc...

    const newObject = ()  => {
        const newStyle = {
            color: "black",
            backgroundColor: "black",
            cursor: "pointer"
        };
        const whenClicked = () => {
            alert('Background has been clicked!');
        };
        onclick = {whenClicked}
        toast.success("User Accepted!")
        toast.dismiss("User Declined!")
        

        return (
            <>
            <p>The buttons will let the user choose an existing image/comment</p>
            <button>{chooseType.chosenImage}</button>
            <button>{chooseType.chosenComment}</button>


            <p>This button will eventually change the Image/Comment to this style:</p>
            <button style = {newStyle}>Change Image/Comment</button>


            
            <button style = {{backgroundColor: rgb(69, 114, 56)}}>Accept user</button>
            <ToastContainer/>
            <button>Decline user</button>
            <ToastContainer/>
            </>
        )
    }
}

//The new background color obstructing the image/comment is clickable by the user, which will reveal a Notification if they want to friend or promote the user

//The User can accept or the user can decline

//TODO: I need to ensure that image actually renders before finishing the code

export default GuessUser;

