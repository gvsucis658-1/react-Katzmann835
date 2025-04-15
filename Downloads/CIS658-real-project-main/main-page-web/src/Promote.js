import { useState, useRef } from 'react';

//If the user clicks promote: post/picture is placed placed at the top, meaning user wants more to see it

function Promote(imageURL, commenttext){
    const promoteToTop = useRef(null);
    
    const handlePromote = () => {
        promoteToTop.current?.scrollIntoView({behavior: 'smooth'});
    };

    const handlePromoteImage = () => {
        handlePromote();
        console.log(imageURL);
    };

    const handlePromoteComment = () => {
        handlePromote();
        console.log(commenttext);
    };

    return (
        <div>
            <div ref={promoteToTop}></div>
            <button onClick={handlePromoteImage}>Promote Image</button>
            <button onClick={handlePromoteComment}>Promote Comment</button>
        </div>
    );
}

export default Promote;