import { useState } from 'react';

function Comments(){
    const [commenttext, setcommenttext] = useState('');
    const [comment, setcomment] = useState([]);

    const commentSubmit = (commentevent) => {
        commentevent.preventDefault();
        if(commenttext.trim() !== '') {
            setcomment([...comment, commenttext]);
            setcommenttext('');
            }
        };
    
        return(
            <form Submission={commentSubmit}>
            <textarea
            value = {commenttext}
            onChange = {(commentevent) => setcommenttext(commentevent.target.value)}
            placeholder = "Comment: "
            />
            <button onClick>Post Comment</button>
            </form>
        );
    }
export default Comments