import {useState, useEffect} from 'react';
import Main from './Main.js';
import Comments from './Comments.js';
import {ToastContainer, toast} from 'react-toastify';


//Psuedocode for the Guess Button:

function GuessUser(){
    const [chosenImage, setchosenImage] = useState('');
    const [chosenComment, setchosenComment] = useState('');
    const [newBackground, setnewBackground] = useState(false);

    const getImageURL = `http://localhost:3001/Main`;
    const getComment = 'comments';

//TODO: the code must choose a picture, or a post that was posted by the user
    const chooseType = () => {

        setchosenImage(getImageURL);
        setchosenComment(getComment);
    }

//TODO: Once clicked, the picture or post will have the css background color that will make the text or picture dissappear

//TODO: The background color for the should be a dark color to obstruct the comment or picture view such as: 
//Black, Brown, Grey, Maroon, Purple, etc...

        const newStyle = {
            color: newBackground ? "black": "inherit",
            backgroundColor: newBackground ? "black": "inherit",
            cursor: "pointer"
        };
        const whenClicked = () => {
            alert('Background has been clicked!');
            setnewBackground(!newBackground);
        };

        const Acceptresult = () => {
            toast.success("User Accepted!")
        };
        const Declineresult = () => {
            toast.error("User Declined!")
        };
        

        return (
            <>
            <p>The buttons will let the user choose an existing image/comment</p>
            <button onClick={chooseType}>Choose Selected Image or Comment?</button>
            <br/>
            
            {chosenImage && (
                <div onClick={whenClicked} style={newStyle}>
                <img src={chosenImage} alt = 'uploads'/>
                </div>
            )}
            {chosenComment && (
                <div onClick={whenClicked} style={newStyle}>
                    <p>{newBackground ? '' : chosenComment}</p>
                </div>
            )}


            <p>This button will eventually change the Image/Comment to this style:</p>
            <button onClick = {() => setnewBackground(true)} style = {{backgroundColor: 'rgb(168, 4, 168)'}}>Change Image/Comment</button>


            
            <button style = {{backgroundColor: 'rgb(69, 114, 56)'}} onClick = {Acceptresult}>Accept user</button>
            <button onClick = {Declineresult}>Decline user</button>
            <ToastContainer/>
            </>
        )
    }

//The new background color obstructing the image/comment is clickable by the user, which will reveal a Notification if they want to friend or promote the user

//The User can accept or the user can decline

//TODO: I need to ensure that image actually renders before finishing the code

export default GuessUser;