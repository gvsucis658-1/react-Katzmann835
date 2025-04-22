import { useState, useEffect } from 'react';

function Friends(){
    const [friends, friendcount] = useState(() => {
        const storedFriends = localStorage.getItem('friendcount');
        return storedFriends ? parseInt(storedFriends, 10): 0;
    });

    useEffect(() => {
        localStorage.setItem('friendcount', friends);
    }, [friends]);

    const friendClicked = () => {
        friendcount(prev => prev + 1);
    };

    return (
        <button onClick={friendClicked}>Total Friends: {friends}</button>
    );
}

export default Friends;