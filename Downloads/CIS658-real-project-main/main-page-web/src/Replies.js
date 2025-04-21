import { useState } from 'react';
import {ToastContainer, toast} from 'react-toastify';
import Likes from './Likes';
import Dislikes from './Dislikes';

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

    const deleteReply = (index) => {
        const newReply = reply.filter((_, i) => i !== index);
        setreply(newReply);
        toast.success('Reply has been deleted!');
    };

    return(
            <div>
            <form onSubmit={replySubmit}>
            <textarea
            value = {replytext}
            onChange = {(replyevent) => setreplytext(replyevent.target.value)}
            placeholder = "Reply: "
            />
            <br />
            <button type = "submit">Reply</button>
            <ToastContainer/>
            <p>Like or dislike Reply?</p>
            <Likes likeId={reply}/>
            <Dislikes dislikeId={reply}/>
            </form>

            <ul>
                {reply.map((reply, index) => (
                    <li key ={index}>{reply}
                    <br></br>
                    <button onClick={() => updateReply(index, prompt("new Reply: "))} style = {{backgroundColor: 'rgb(168, 4, 168)'}}>Edit Reply to User</button>
                    <button onClick={() => deleteReply(index)}>Delete Reply</button>
                    </li>
                ))}
            </ul>
            </div>
        );
}
export default Replies;