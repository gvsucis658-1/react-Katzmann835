import { useState, useEffect } from 'react';
import {ToastContainer, toast} from 'react-toastify';

function Comments(){
    const [commenttext, setcommenttext] = useState('');
    const [comment, setcomment] = useState([]);

    useEffect(() => {
        const Commented = localStorage.getItem('comments');
        if (Commented) {
            setcomment(JSON.parse(Commented));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('comments', JSON.stringify(comment));
    }, [comment]);

    const commentSubmit = (commentevent) => {
        commentevent.preventDefault();
        if(commenttext.trim() !== '') {
            setcomment([...comment, commenttext]);
            setcommenttext('');
            toast.success('New comment added!');
            }
        };

    const updateComment = (index) => {
        const UpdatedComment = prompt('New Comment: ');
        if (UpdatedComment !== null && UpdatedComment.trim() !== ''){
            const newComment = [...comment];
            newComment[index] = UpdatedComment;
            setcomment(newComment);
            toast.success('Comment has been updated!');
        }
    };

    const deleteComment = (index) => {
        const newComment = comment.filter((_, i) => i !== index);
        setcomment(newComment);
        toast.success('Comment has been deleted!');
    }
        
    
        return(
            <div>
            <form onSubmit={commentSubmit}>
            <textarea
            value = {commenttext}
            onChange = {(commentevent) => setcommenttext(commentevent.target.value)}
            placeholder = "Comment: "
            />
            <br />
            <button type = "submit">Post Comment</button>
            <ToastContainer/>
            </form>

            <ul>
                {comment.map((comment, index) => (
                    <li key ={index}>{comment}
                    <br></br>
                    <button onClick={() => updateComment(index)}>Edit Comment</button>
                    <button onClick={() => deleteComment(index)}>Delete Comment</button>
                    
                    </li>
                ))}
            </ul>
            </div>
        );
    }
export default Comments;