import { useState, useEffect } from 'react';

function Likes({likeId}){
    const [likes, setLikes] = useState(() => {
        const LikesUsed = localStorage.getItem(`likes-${likeId}`);
        return LikesUsed ? JSON.parse(LikesUsed) : 0;
    });

    useEffect(() => {
        localStorage.setItem(`likes-${likeId}`, JSON.stringify(likes));
    }, [likes, likeId])

    const likeClicked = () => {
        console.log(`Adds link with ID: ${likeId}`);
        setLikes(likes + 1);
    };

    return (
        <button onClick={likeClicked} style = {{backgroundColor: 'rgb(69, 114, 56)'}}>Like: {likes} </button> 
    );
}

export default Likes;