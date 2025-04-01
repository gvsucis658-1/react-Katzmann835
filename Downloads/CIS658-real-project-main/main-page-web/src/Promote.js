import { useState } from 'react';
import Likes from './Likes.js';
import Main from './Main.js';
import Comments from './Comments.js'

//If the user clicks promote: post/picture is placed placed at the top, meaning user wants more to see it

function Promote(){
    const [promote, promoted] = useState(0);

    if (Likes >= 1 && Main === true && Comments === true){

        const promoteUsed = () => {
            promoted(promote);
        }
    return (
        <div style ={{position: 'relative', top: '50px'}}>
            <button onClick={promoteUsed}>Promote: {promote} </button> 
        </div>
    );
    }
}

export default Promote;