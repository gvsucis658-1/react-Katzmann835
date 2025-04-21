import './App.css';
import React, {useState, useEffect} from 'react';
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
import GuessUser from './GuessUser.js';
import {ToastContainer, toast} from 'react-toastify';

function Main() {

    const [imageURL, newimageURL] = useState([]);

    useEffect(() => {
        const reloadImage = JSON.parse(localStorage.getItem('uploads'));
        if (reloadImage && reloadImage.length > 0){
            newimageURL(reloadImage);
        };
    }, []);

    useEffect(() => {
        localStorage.setItem('uploads', JSON.stringify(imageURL));
    }, [imageURL]);

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

    const deleteImage = (index) => {
        const DelImg = window.confirm('Are you sure you want to delete this image?')
        if (DelImg){
            const updatedimage = [...imageURL];
            updatedimage.splice(index, 1);
            newimageURL(updatedimage);
            toast.info('Image Deleted!');
        }
    };

    return (
        <div>
            <h1 style = {{fontWeight: '1000', boxShadow: '10px 10px 2.5px black', }}>Nathan's social media website</h1>

            <div style = {{border: 'solid 1.5px', boxShadow: '5px 1px 3px black', backgroundColor: 'cyan'}}>
            <h2 style = {{fontWeight: '500'}}> Post a picture: </h2>
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
                        <div>
                        <img
                            key={index}
                            src={url}
                            alt="uploads"
                            style={{height: '350px', width: '350px', border: 'solid 3px'}}
                        />
                        <br />
                        <button onClick = {() => deleteImage(index)}> Delete Image</button>
                        </div>
                    ))}
                </div>
            )}
            <ToastContainer/>
            <p>Like or dislike Image?</p>
            <Likes likeId={imageURL}/>
            <Dislikes dislikeId={imageURL}/>
            </div>
            <br />

            <div style = {{border: 'solid 1.5px', boxShadow: '5px 1px 3px black', backgroundColor: 'cyan'}}>
            <h2 style = {{fontWeight: '500'}}>Comments: </h2>
            <Comments />
            </div>
            <br/>

            <div style = {{border: 'solid 1.5px', boxShadow: '5px 1px 3px black', backgroundColor: 'cyan'}}>
            <h2 style = {{fontWeight: '500'}}>Reply to the post: </h2>
            <Replies />
            </div>
            <br/>

            <div style = {{border: 'solid 1.5px', boxShadow: '5px 1px 3px black', backgroundColor: 'cyan'}}>
            <h2 style = {{fontWeight: '500'}}>Friends: </h2>
            <Friends />
            </div>
            <br />

            <div style = {{border: 'solid 1.5px', boxShadow: '5px 1px 3px black', backgroundColor: 'cyan'}}>
            <h2 style = {{fontWeight: '500'}}>Limit/Unlimit Friend amount: </h2>
            <FriendLimit />
            </div>
            <br />

            <div style = {{border: 'solid 1.5px', boxShadow: '5px 1px 3px black', backgroundColor: 'cyan'}}>
            <h2 style = {{fontWeight: '500'}}>Unfriend: </h2>
            <Unfriend />
            </div>
            <br />

            <div style = {{border: 'solid 1.5px', boxShadow: '5px 1px 3px black', backgroundColor: 'cyan'}}>
            <h2 style = {{fontWeight: '500'}}>Promote: </h2>
            <Promote />
            </div>
            <br />

            <div style = {{border: 'solid 1.5px', boxShadow: '5px 1px 3px black', backgroundColor: 'cyan'}}>
            <h2 style = {{fontWeight: '500'}}>Demote: </h2>
            <Demote />
            </div>
            <br />

            <div style = {{border: 'solid 1.5px', boxShadow: '5px 1px 3px black', backgroundColor: 'cyan'}}>
            <h2 style = {{fontWeight: '500'}}>Guess the User Image/Comment: </h2>
            <GuessUser />
            </div>
            <br />

            <div style = {{border: 'solid 1.5px', boxShadow: '5px 1px 3px black', backgroundColor: 'cyan'}}>
            <h2 style = {{fontWeight: '500'}}>Logout: </h2>
            <Logout />
            </div>
            <br />
            
            </div>
    )
}
export default Main;