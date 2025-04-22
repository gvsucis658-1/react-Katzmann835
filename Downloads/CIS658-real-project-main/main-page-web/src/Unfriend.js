import { useState, useEffect } from 'react';

function Unfriend(){
    const [unfriend, deleteFriend] = useState(() => {
            const storedunFriend = localStorage.getItem('deleteFriend');
            return storedunFriend ? parseInt(storedunFriend, 10): 0;
        });
    
        useEffect(() => {
            localStorage.setItem('deleteFriend', unfriend);
        }, [unfriend]);

    const unfriendClicked = () => {
        deleteFriend(unfriend + 1);
    };

    return (
        <button onClick={unfriendClicked}>Users unfriended: {unfriend}</button>
    );
}

export default Unfriend;