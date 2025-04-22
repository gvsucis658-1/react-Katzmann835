import { useState, useEffect } from 'react';

//This function will a set limit to how many friends a user has, and unlimit will reverse this

function FriendLimit(){
    const limit = 4;
    const [friends, friendcount] = useState(() => {
        const storeFriendLimit = localStorage.getItem('friends');
        return storeFriendLimit ? parseInt(storeFriendLimit, 10) : 0;
    });

    const [friendLimited, setLimit] = useState(() => {
        const storeFriendLimit = localStorage.getItem('friendLimited');
        return storeFriendLimit ? JSON.parse(storeFriendLimit) : false;
    });

    useEffect(() => {
        localStorage.setItem('friends', friends);
    }, [friends]);

    useEffect(() => {
        localStorage.setItem('friendLimited', friendLimited);
    }, [friendLimited]);

    const friendCount = () => {
        if(friendLimited && friends >= limit){
            return;
        }
        friendcount(prev => prev + 1);
    };

    const toggleLimit = () => {
        setLimit(prev => !prev);
    };

    return(
        <div>
        <p>Friend Limit: {friends}</p>
        <button onClick={friendCount}>Friend Count Limit</button>
        <button onClick={toggleLimit}>{friendLimited ? 'Unlimit' : 'Limit'}</button>
        </div>
    )
}

export default FriendLimit;