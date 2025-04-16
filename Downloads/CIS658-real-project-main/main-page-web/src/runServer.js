import { useState, useEffect } from 'react';
import axios from 'axios';

function RunServer(){
    const [App, setApp] = useState([]);
    const [newApp, setNewApp] = useState('');

    useEffect(() => {
        fetchApp();
    }, []);

    const fetchApp = async () => {
        const response = await axios.get('http://localhost:3001/App');
        setApp(response.data.App);
    };

    const addApp = async () => {
        await axios.post('http://localhost:3001/App', {name: newApp});
        setNewApp('');
        fetchApp();
    };

    const deleteApp = async (id) => {
        await axios.delete(`http://localhost:3001/App/${id}`);
        fetchApp();
    }

    return (
        <>
        <h1 style={{fontWeight: '1000', boxShadow: '10px 10px 2.5px black', }}>App Server</h1>
        <div style = {{border: 'solid 1.5px', boxShadow: '5px 1px 3px black', backgroundColor: 'cyan'}}>
        <ul>
            {App.map(app => (
                <li key={app.id}>
                {app.name}
                <button onClick={() => deleteApp(app.id)}>Delete</button>
                </li>
            ))}
        </ul>

        <p>Add new app:</p>
        <input type="text" value={newApp} onChange={e => setNewApp(e.target.value)} />
        <br/>
        <button onClick={addApp}> Add App </button>
        </div>
        </>
    );
}

export default RunServer;