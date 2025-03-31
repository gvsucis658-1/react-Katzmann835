import './App.css';
import React from 'react';
import Comments from './Comments.js';
import Likes from './Likes.js';
import Dislikes from './Dislikes.js';
import Friends from './Friends.js';
import Unfriend from './Unfriend.js';
import Replies from './Replies.js';

function Main() {
    const postImage = (event) => {
    const file = event.target.files[0];
    if (file){
        const ImageData = new FormData();
        ImageData.append('image', file);

        fetch('http://localhost:3000', {
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
            event.target.value = null;
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

            <input type = "file"
            id = "image_upload"
            accept = "image/*"
            style = {{display: 'none'}}
            onChange = {postImage}></input>

            <button onClick={() => document.getElementById('image_upload').click()}>Post Picture</button>

            <Comments />

            <p>Likes: </p>
            <Likes />
            <br></br>

            <p>Dislikes: </p>
            <Dislikes />
            <br></br>

            <p>Reply to the post: </p>
            <Replies />
            <br></br>

            <p>Friends: </p>
            <Friends />
            <br></br>

            <p>Unfriend: </p>
            <Unfriend />
            </div>
    )
}
export default Main;