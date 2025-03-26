import './App.css';
import Comments from './Comments.js';
import Likes from './Likes.js';
import Dislikes from './Dislikes.js';

function App() {

  const postImage = (event) => {
    const file = event.target.file[0];
      if (file){
        const ImageData = new ImageData();
        ImageData.append('image', file);

        fetch('/App', {
          method: 'POST',
          body: ImageData
        })
        .then(response => response.json())
        .then(data => {
          console.log('Image uploaded', data);
        })
        .catch(error => {
          console.error('Image failed to upload:', error);
        });
      }
    };
  
  return (
    <div className="App">
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

      <button onClick>Reply</button>

      <button onClick>Friend</button>

      <button onClick>Unfriend</button>
    </div>
  );
}

export default App;
