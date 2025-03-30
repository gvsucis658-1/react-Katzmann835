import { useState, useEffect } from 'react';
import axios from 'axios';

function RunServer(){
    const [App, setApp] = useState([]);
    const [newApp, setNewApp] = useState('');

    useEffect(() => {
        fetchApp();
    }, []);

    const fetchApp = async () => {
        const response = await axios.get('https://localhost:3001/App');
        setApp(response.data.App);
    };

    const addApp = async () => {
        await axios.post('https://localhost:3001/App', {name: newApp});
        setNewApp('');
        fetchApp();
    };

    const deleteApp = async (id) => {
        await axios.delete('https://localhost:3001/App/${id}');
        fetchApp();
    }

    return (
        <>
        <h1>App Server</h1>
        <ul>
            {App.map(App => (
                <li key={App.id}>
                {App.name}
                <button onClick={() => deleteApp(App.id)}>Delete</button>
                </li>
            ))};
        </ul>

        <input type="text" value={newApp} onChange={e => setNewApp(e.target.value)} />
        <button onClick={addApp}> Add App </button>
        </>
    );
}

export default RunServer;