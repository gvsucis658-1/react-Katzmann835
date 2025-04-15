import './App.css';
import React, {useState} from 'react';
import Comments from './Comments.js';
import Likes from './Likes.js';
import Dislikes from './Dislikes.js';
import Friends from './Friends.js';
import Unfriend from './Unfriend.js';
import Replies from './Replies.js';
import Promote from './Promote.js';
import Demote from './Demote.js';
import FriendLimit from './FriendLimit.js';
import Logout from './Logout.js';
import {ToastContainer, toast} from 'react-toastify';

function Main() {

    const [imageURL, newimageURL] = useState(null);

    const postImage = (event) => {
    const file = event.target.files[0];
    if (file){
        const ImageData = new FormData();
        ImageData.append('image', file);

        fetch('http://localhost:3001/Main', {
            method: 'POST',
            body: ImageData,
        })
        .then(response => {
            if (!response.ok) {
            throw new Error('Image failed to upload');
        }
        return response.json();
        })
        .then(data => {
            console.log('Image uploaded', data);
            const uploadedImageURL = `http://localhost:3001${data.imageURL}`;
            newimageURL(uploadedImageURL);
            event.target.value = null;
            toast.success('New Image Added!');
        })
        .catch(error => {
            console.error('Image failed to upload:', error);
        });
    } else {
        console.error('User failed to select an image');
    }
    };
    return (
        <div>
            <h1>Nathan's social media website</h1>

            <p>Post a picture: </p>
            <input type = "file"
            id = "image_upload"
            accept = "image/*"
            style = {{display: 'none'}}
            onChange = {postImage}></input>

            <button onClick={() => document.getElementById('image_upload').click()}>Post Picture</button>

            {imageURL && (
                <div>
                    <img src = {imageURL} alt = "uploads" style = {{height: '350px', width: '350px', border: 'solid 3px'}}/>
                </div>
            )}
            <ToastContainer/>
            <br />

            <p>Comments: </p>
            <Comments />

            <p>Likes: </p>
            <Likes />
            <br />

            <p>Dislikes: </p>
            <Dislikes />
            <br />

            <p>Reply to the post: </p>
            <Replies />
            <br />

            <p>Friends: </p>
            <Friends />
            <br />

            <p>Limit/Unlimit Friend amount: </p>
            <FriendLimit />
            <br />

            <p>Unfriend: </p>
            <Unfriend />
            <br />

            <p>Promote:</p>
            <Promote />
            <br />

            <p>Demote:</p>
            <Demote />
            <br />

            <p>Logout:</p>
            <Logout />
            <br />
            
            </div>
    )
}
export default Main;