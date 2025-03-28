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

    const updateComment = (index, updateComment) => {
        const newComment = [...comment];
        newComment[index] = updateComment;
        setcomment(newComment);
    };

    const deleteComment = (index) => {
        const newComment = comment.filter((_, i) => i !== index);
        setcomment(newComment);
    }
        
    
        return(
            <div>
            <form onSubmit={commentSubmit}>
            <textarea
            value = {commenttext}
            onChange = {(commentevent) => setcommenttext(commentevent.target.value)}
            placeholder = "Comment: "
            />
            <button type = "submit">Post Comment</button>
            </form>

            <ul>
                {comment.map((comment, index) => (
                    <li key ={index}>{comment}
                    <br></br>
                    <button onClick={() => updateComment(index, prompt("new Comment: "))}>Edit Comment</button>
                    <button onClick={() => deleteComment(index)}>Delete Comment</button>
                    
                    </li>
                ))}
            </ul>
            </div>
        );
    }
export default Comments