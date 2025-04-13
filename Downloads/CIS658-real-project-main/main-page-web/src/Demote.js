import { useState } from 'react';
import react, { useRef } from 'react';
import Likes from './Likes.js';
import Main from './Main.js';
import Comments from './Comments.js'

//If the user clicks promote: post/picture is placed placed at the bottom, meaning user wants less to see it

function Demote(){
    const demoteToBottom = useRef(null);
    const callImage = Main.call('Image has been Retrieved').uploadedImageURL
    const callComment = Comments.call('Image has been Retrieved').setcommenttext
        
    const handleDemote = () => {
        demoteToBottom.current.scrollintoview({behavior: 'smooth'});
    };
    
    return (
        <div>
            <div ref={demoteToBottom}></div>
            <button onClick={[handleDemote, callImage]}>Demote Image</button>
            <button onClick={[handleDemote, callComment]}>Demote Comment</button>
        </div>
    );
}
export default Demote;