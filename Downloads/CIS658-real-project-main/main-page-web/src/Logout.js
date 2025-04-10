import { useNavigate } from 'react-router-dom';
import './Design.css';

function Logout(){
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        navigate('/Login');
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
}

export default Logout;