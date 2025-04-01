import { useState } from 'react';
import Likes from './Likes.js';
import Main from './Main.js';
import Comments from './Comments.js'

//If the user clicks promote: post/picture is placed placed at the bottom, meaning user wants less to see it

function Demote(){
    const [demote, demoted] = useState(0);

    if (Likes === 1 && Main === true && Comments === true){

        const demoteUsed = () => {
            demoted(demote);
        }

    return (
        <div style ={{position: 'relative', bottom: '50px'}}>
            <button onClick={demoteUsed}>Demote: {demote} </button> 
        </div>
    );
}
}
export default Demote;