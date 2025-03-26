import { useState } from 'react';

function Friends(){
    const [friends, friendcount] = useState(0);
    const friendClicked = () => {
        friendcount(friends + 1);
    };

    return (
        <button onClick={friendClicked}>Total Friends: {friends}</button>
    );
}

export default Friends;