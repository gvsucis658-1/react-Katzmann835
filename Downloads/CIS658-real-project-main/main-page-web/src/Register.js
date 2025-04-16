import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register(){
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    const[confirmpassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const submitForm = async (event) => {
        event.preventDefault();
    
    if (password !== confirmpassword){
        console.log("Password does not match")
    }

    const response = await fetch('http://localhost:3001/Register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password}),
        });
        const data = await response.json();

        if (response.ok){
            navigate('/Login');
        } else {
            alert(data.message);
        }
    };

    return (
        <form onSubmit={submitForm}>
            <h1 style = {{fontWeight: '1000', boxShadow: '10px 10px 2.5px black', }}>Register New User:</h1>
            <div style = {{border: 'solid 1.5px', boxShadow: '5px 1px 3px black', backgroundColor: 'cyan'}}>
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
            <div>
                <label htmlFor='confirmpassword'>Confirm Password:</label>
                <input
                    type= "password"
                    id= "confirmpassword"
                    name= "confirmpassword"
                    value= {confirmpassword}
                    onChange= {(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </div>
            <button type = "submit">Login</button>
            </div>
        </form>
    )
}
export default Register;