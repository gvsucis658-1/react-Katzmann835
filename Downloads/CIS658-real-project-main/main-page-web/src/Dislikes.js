import { useState } from 'react';

function Dislikes(){
    const [dislikes, dislikecount] = useState(0);

    const dislikeClicked = () => {
        dislikecount(dislikes + 1);
    };

    return (
        <button onClick={dislikeClicked}>Dislike: {dislikes} </button>
    );
}

export default Dislikes;