import './App.css';
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Main from './Main.js'
import UseLogin from './UseLogin.js';
import RunServer from './RunServer.js';
import Login from './Login.js';
import Register from './Register.js';

function App() {
  return (
    <div className="App">

      <h1>Login:</h1>
      <Router>
        <Routes>
          <Route path = "/UseLogin" element = {<UseLogin />} />
          <Route path = "/Register" element = {<Register />} />
          <Route path = "/Login" element = {<Login />}/>
          <Route path = "/Main" element = {<Main />} />
          <Route path = "/" element = {<UseLogin />}/>
          <Route path = "/RunServer" element = {<RunServer />}/>
        </Routes>
      </Router>

    </div>
  );
}

export default App;
