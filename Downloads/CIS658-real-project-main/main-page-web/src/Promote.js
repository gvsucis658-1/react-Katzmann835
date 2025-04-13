import { useState } from 'react';
import react, { useRef } from 'react';
import Likes from './Likes.js';
import Main from './Main.js';
import Comments from './Comments.js'

//If the user clicks promote: post/picture is placed placed at the top, meaning user wants more to see it

function Promote(){
    const promoteToTop = useRef(null);
    const callImage = Main.call('Image has been Retrieved').uploadedImageURL
    const callComment = Comments.call('Image has been Retrieved').setcommenttext
    
    const handlePromote = () => {
        promoteToTop.current.scrollintoview({behavior: 'smooth'});
    };

    return (
        <div>
            <div ref={promoteToTop}></div>
            <button onClick={[handlePromote, callImage]}>Promote Image</button>
            <button onClick={[handlePromote, callComment]}>Promote Comment</button>
        </div>
    );
}

export default Promote;