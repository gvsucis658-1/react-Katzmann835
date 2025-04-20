import { useState } from 'react';

function Dislikes(dislikeId){
    const [dislikes, dislikecount] = useState(0);

    const dislikeClicked = () => {
        console.log(`Adds link with ID: ${dislikeId}`);
        dislikecount(dislikes + 1);
    };

    return (
        <button onClick={dislikeClicked}>Dislike: {dislikes} </button>
    );
}

export default Dislikes;