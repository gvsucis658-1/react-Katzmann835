import { useState } from 'react';

function Likes({likeId}){
    const [likes, likecount] = useState(0);

    const likeClicked = () => {
        console.log(`Adds link with ID: ${likeId}`);
        likecount(likes + 1);
    };

    return (
        <button onClick={likeClicked}>Like: {likes} </button> 
    );
}

export default Likes;