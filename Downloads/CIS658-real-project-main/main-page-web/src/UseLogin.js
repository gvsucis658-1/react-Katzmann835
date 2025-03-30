import { useState } from 'react';
import Login from './Login.js';

function UseLogin() {
    const [user, setUser] = useState(null);
    const handleLogin = (username) => {
        setUser(username);
    };

    const handleLogout = () => {
        setUser(null);
    }

    return (
        <div>
            {user ? (
                <div>
                    <button onClick = {handleLogout}>Logout</button>
                </div>

            ) : (
                <Login onLogin = {handleLogin}/>
            )}
        </div>
    );
}

export default UseLogin;