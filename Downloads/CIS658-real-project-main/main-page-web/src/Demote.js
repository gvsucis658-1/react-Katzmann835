import { useState, useRef } from 'react';

//If the user clicks promote: post/picture is placed placed at the bottom, meaning user wants less to see it

function Demote(imageURL, commenttext){
    const demoteToBottom = useRef(null);
        
    const handleDemote = () => {
        demoteToBottom.current?.scrollIntoView({behavior: 'smooth'});
    };

    const handleDemoteImage = () => {
        handleDemote();
        console.log(imageURL);
    };

    const handleDemoteComment = () => {
        handleDemote();
        console.log(commenttext);
    };
    
    return (
        <div>
            <div ref={demoteToBottom} style={{position: '1000 px'}}></div>
            <button onClick={handleDemoteImage}>Demote Image</button>
            <button onClick={handleDemoteComment}>Demote Comment</button>
        </div>
    );
}

export default Demote;