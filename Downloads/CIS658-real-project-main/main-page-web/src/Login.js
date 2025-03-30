import { useState } from 'react';

function Login(){
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');

    const submitForm = async (event) => {
        event.preventDefault();

        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password}),
        });
        const data = await response.json();

        if (response.ok){
            sessionStorage.setItem('token', data.token);
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
                />
            </div>
            <div>
                <label htmlFor='password'>Password:</label>
                <input
                    type= "text"
                    id= "password"
                    name= "password"
                    value= {password}
                    onChange= {(e) => setPassword(e.target.value)}
                />
            </div>
        <button type = "submit">Login</button>
        </form>
    );
}
export default Login;