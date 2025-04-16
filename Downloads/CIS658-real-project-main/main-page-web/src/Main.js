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

    const [imageURL, newimageURL] = useState([]);

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
            newimageURL(prev => [...prev, uploadedImageURL]);
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
            <h1 style = {{fontWeight: '1000', boxShadow: '10px 10px 2.5px black', }}>Nathan's social media website</h1>

            <div style = {{border: 'solid 1.5px', boxShadow: '5px 1px 3px black', backgroundColor: 'cyan'}}>
            <p style = {{fontWeight: '500'}}> Post a picture: </p>
            <input type = "file"
            id = "image_upload"
            accept = "image/*"
            multiple
            style = {{display: 'none'}}
            onChange = {postImage}></input>

            <button onClick={() => document.getElementById('image_upload').click()}>Post Picture</button>

            {imageURL.length > 0 && (
                <div>
                    {imageURL.map((url, index) => (
                        <img
                            key={index}
                            src={url}
                            alt="uploads"
                            style={{height: '350px', width: '350px', border: 'solid 3px'}}
                        />
                    ))}
                </div>
            )}
            <ToastContainer/>
            </div>
            <br />

            <div style = {{border: 'solid 1.5px', boxShadow: '5px 1px 3px black', backgroundColor: 'cyan'}}>
            <p style = {{fontWeight: '500'}}>Comments: </p>
            <Comments />
            </div>
            <br/>

            <div style = {{border: 'solid 1.5px', boxShadow: '5px 1px 3px black', backgroundColor: 'cyan'}}>
            <p style = {{fontWeight: '500'}}>Likes: </p>
            <Likes />
            </div>
            <br/>

            <div style = {{border: 'solid 1.5px', boxShadow: '5px 1px 3px black', backgroundColor: 'cyan'}}>
            <p style = {{fontWeight: '500'}}>Dislikes: </p>
            <Dislikes />
            </div>
            <br/>

            <div style = {{border: 'solid 1.5px', boxShadow: '5px 1px 3px black', backgroundColor: 'cyan'}}>
            <p style = {{fontWeight: '500'}}>Reply to the post: </p>
            <Replies />
            </div>
            <br/>

            <div style = {{border: 'solid 1.5px', boxShadow: '5px 1px 3px black', backgroundColor: 'cyan'}}>
            <p style = {{fontWeight: '500'}}>Friends: </p>
            <Friends />
            </div>
            <br />

            <div style = {{border: 'solid 1.5px', boxShadow: '5px 1px 3px black', backgroundColor: 'cyan'}}>
            <p style = {{fontWeight: '500'}}>Limit/Unlimit Friend amount: </p>
            <FriendLimit />
            </div>
            <br />

            <div style = {{border: 'solid 1.5px', boxShadow: '5px 1px 3px black', backgroundColor: 'cyan'}}>
            <p style = {{fontWeight: '500'}}>Unfriend: </p>
            <Unfriend />
            </div>
            <br />

            <div style = {{border: 'solid 1.5px', boxShadow: '5px 1px 3px black', backgroundColor: 'cyan'}}>
            <p style = {{fontWeight: '500'}}>Promote: </p>
            <Promote />
            </div>
            <br />

            <div style = {{border: 'solid 1.5px', boxShadow: '5px 1px 3px black', backgroundColor: 'cyan'}}>
            <p style = {{fontWeight: '500'}}>Demote: </p>
            <Demote />
            </div>
            <br />

            <div style = {{border: 'solid 1.5px', boxShadow: '5px 1px 3px black', backgroundColor: 'cyan'}}>
            <p style = {{fontWeight: '500'}}>Logout: </p>
            <Logout />
            </div>
            <br />
            
            </div>
    )
}
export default Main;