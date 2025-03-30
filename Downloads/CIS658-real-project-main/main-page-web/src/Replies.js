import { useState } from 'react';

function Replies(){
    const [replytext, setreplytext] = useState('');
    const [reply, setreply] = useState([]);

    const replySubmit = (replyevent) => {
        replyevent.preventDefault();
        if(replytext.trim() !== '') {
            setreply([...reply, replytext]);
            setreplytext('');
            }
        };

    const updateReply = (index, updateReply) => {
        const newReply = [...reply];
        newReply[index] = updateReply;
        setreply(newReply);
    };

    return(
            <div>
            <form onSubmit={replySubmit}>
            <textarea
            value = {replytext}
            onChange = {(replyevent) => setreplytext(replyevent.target.value)}
            placeholder = "Reply: "
            />
            <button type = "submit">Reply</button>
            </form>

            <ul>
                {reply.map((reply, index) => (
                    <li key ={index}>{reply}
                    <br></br>
                    <button onClick={() => updateReply(index, prompt("new Reply: "))}>Edit Reply to User</button>
                    </li>
                ))}
            </ul>
            </div>
        );
}
export default Replies;