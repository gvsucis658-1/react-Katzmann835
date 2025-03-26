import { useState } from 'react';

function Unfriend(){
    const [unfriend, deleteFriend] = useState(0);
    const unfriendClicked = () => {
        deleteFriend(unfriend + 1);
    };

    return (
        <button onClick={unfriendClicked}>Users unfriended: {unfriend}</button>
    );
}

export default Unfriend;