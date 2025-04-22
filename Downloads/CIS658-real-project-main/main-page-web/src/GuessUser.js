import {useState, useEffect} from 'react';
import {ToastContainer, toast} from 'react-toastify';


//Psuedocode for the Guess Button:

function GuessUser(){
    const [chosenImage, setchosenImage] = useState('');
    const [chosenComment, setchosenComment] = useState('');
    const [newBackground, setnewBackground] = useState(false);

    const getImageURL = `http://localhost:3001/uploads/image-1745255785405.jpeg`;
    const getComment = JSON.parse(localStorage.getItem('comments')) || [];

    useEffect(() => {
        if(getComment.length > 0){
            setchosenComment(getComment[0]);
        }
        setchosenImage(getImageURL);
    }, []);

//TODO: the code must choose a picture, or a post that was posted by the user
    const chooseType = () => {
        setchosenImage(getImageURL);
        setchosenComment(getComment.length > 0 ? getComment[0] : 'Comment is not avalible');
    }

//TODO: Once clicked, the picture or post will have the css background color that will make the text or picture dissappear

//TODO: The background color for the should be a dark color to obstruct the comment or picture view such as: 
//Black, Brown, Grey, Maroon, Purple, etc...

        const newStyle = {
            color: newBackground ? "black": "inherit",
            backgroundColor: newBackground ? "black": "inherit",
            cursor: "pointer",
            padding: "10px"
        };

        const imageStyle = {
            display: newBackground ? "none": "block",
            maxWidth: "100%",
            height: "auto"
        }
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
            <p>The buttons will let the user choose an existing image/comment:</p>
            <button onClick={chooseType}>Choose Selected Image or Comment?</button>
            <br/>
            
            {chosenImage && (
                <div onClick={whenClicked} style={imageStyle}>
                <img src={chosenImage} 
                alt = 'uploads'
                style = {{
                    height: '350px', width: '350px', border: 'solid 3px'
                }}
                />
                </div>
            )}
            {chosenComment && (
                <div onClick={whenClicked} style={newStyle}>
                    <p>{newBackground ? '' : chosenComment}</p>
                </div>
            )}


            <p>Change the Image/Comment to this style once pressed:</p>
            <button onClick = {() => setnewBackground(true)} style = {{backgroundColor: 'rgb(168, 4, 168)'}}>Change Image/Comment</button>
            <br />

            <p>Once done, user can either accept/reject user:</p>
            
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