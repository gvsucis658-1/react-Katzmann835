import { useState, useEffect } from 'react';

function Dislikes({dislikeId}){
    const [dislikes, setDislikes] = useState(() => {
            const DislikesUsed = localStorage.getItem(`dislikes-${dislikeId}`);
            return DislikesUsed ? JSON.parse(DislikesUsed) : 0;
    });
    
    useEffect(() => {
        localStorage.setItem(`dislikes-${dislikeId}`, JSON.stringify(dislikes));
    }, [dislikes, dislikeId])

    const dislikeClicked = () => {
        console.log(`Adds link with ID: ${dislikeId}`);
        setDislikes(dislikes + 1);
    };

    return (
        <button onClick={dislikeClicked}>Dislike: {dislikes} </button>
    );
}

export default Dislikes;