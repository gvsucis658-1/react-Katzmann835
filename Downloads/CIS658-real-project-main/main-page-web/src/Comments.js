import { useState, useEffect } from 'react';
import {ToastContainer, toast} from 'react-toastify';
import Likes from './Likes';
import Dislikes from './Dislikes';

function Comments(){
    const [commenttext, setcommenttext] = useState('');
    const [comment, setcomment] = useState([]);

    useEffect(() => {
        const Commented = localStorage.getItem('comments');
        if (Commented) {
            try{
                setcomment(JSON.parse(Commented));
            } catch (error) {
                console.error('Was not able to retireve the comment', error);
            }
        }
    }, []);

    useEffect(() => {
        if (comment.length > 0){
            try {
                localStorage.setItem('comments', JSON.stringify(comment));
            } catch (error) {
                console.error('Was not able to reload the comment', error);
            }
        }
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
            <p>Like or dislike comment?</p>
            <Likes likeId={comment}/>
            <Dislikes dislikeId={comment}/>
            </form>

            <ul>
                {comment.map((CommentItem, index) => (
                    <li key ={index}>{CommentItem}
                    <br></br>
                    <button onClick={() => updateComment(index)} style = {{backgroundColor: 'rgb(168, 4, 168)'}}>Edit Comment</button>
                    <button onClick={() => deleteComment(index)}>Delete Comment</button>
                    
                    </li>
                ))}
            </ul>
            </div>
        );
    }
export default Comments;