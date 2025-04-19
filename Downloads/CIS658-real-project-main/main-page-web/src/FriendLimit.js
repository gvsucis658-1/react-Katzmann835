import { useState } from 'react';

//This function will a set limit to how many friends a user has, and unlimit will reverse this

function FriendLimit(){
    const [friends, friendcount] = useState(0);
    const [friendLimited, setLimit] = useState(false);
    const limit = 4;

    const friendCount = () => {
        if(friendLimited && friends >= limit){
            return;
        }
        friendcount(newCount => newCount + 1);
    };

    const toggleLimit = () => {
        setLimit(newCount => !newCount);
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