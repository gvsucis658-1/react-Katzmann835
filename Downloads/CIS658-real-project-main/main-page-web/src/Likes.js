import { useState } from 'react';

function Likes(){
    const [likes, likecount] = useState(0);

    const likeClicked = () => {
        likecount(likes + 1);
    };

    return (
        <button onClick={likeClicked}>Like: {likes} </button> 
    );
}

export default Likes;