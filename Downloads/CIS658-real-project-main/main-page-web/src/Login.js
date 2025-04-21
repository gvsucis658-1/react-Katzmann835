import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Design.css';

function Login(){
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    const navigate = useNavigate();

    const submitForm = async (event) => {
        event.preventDefault();

        const response = await fetch('http://localhost:3001/App', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password}),
        });
        const data = await response.json();

        if (response.ok && data.token){
            sessionStorage.setItem('token', data.token);
            navigate('/Main');
        } else {
            alert(data.message);
        }

    };
    return(
        <form onSubmit={submitForm}>
            <h1 style = {{fontWeight: '1000', boxShadow: '10px 10px 2.5px black', }}>Login</h1>
            <div style = {{border: 'solid 1.5px', boxShadow: '5px 1px 3px black', backgroundColor: 'cyan'}}>
            <div>
                <h2 style = {{fontWeight: '500'}}>Login User: </h2>
                <label htmlFor='username'>Username:</label>
                <input
                    type= "text"
                    id= "username"
                    value= {username}
                    onChange= {(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor='password'>Password:</label>
                <input
                    type= "password"
                    id= "password"
                    name= "password"
                    value= {password}
                    onChange= {(e) => setPassword(e.target.value)}
                    required
                />
            </div>
        <button type = "submit">Login</button>
        <br/>
        <p>Need a new account, <span style = {{fontweight:'700px'}}>Register here:</span></p>
        <a href = "/Register">Register</a>

        <br />
        <p>Access to server:</p>
        <a href = "/RunServer">Server</a>
        <br />
        <p>Access to Friend list:</p>
        <a href = "/Friends_list">Friend List</a>
        </div>
        </form>
    );
}
export default Login;