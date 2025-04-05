import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
            <div>
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
        </form>
    );
}
export default Login;