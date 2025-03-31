import './App.css';
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Main from './Main.js'
import UseLogin from './UseLogin.js';

function App() {

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
    <div className="App">

      <h1>Login:</h1>
      <Router>
        <Routes>
          <Route path = "/UseLogin" element = {<UseLogin/>} />
          <Route path = "/App" element = {<Main />} />
          <Route path = "/" element = {<UseLogin/>}/>
        </Routes>
      </Router>
      <br></br>

    </div>
  );
}

export default App;
