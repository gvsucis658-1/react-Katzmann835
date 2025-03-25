const express = require('express')
const Application = express()
const port = 3000;

Application.use(express.json())
Application.get('/App', (req, res) => {
    res.json({message: 'App works as intended'});
});

Application.listen(port, () => {
    console.log('Server listening on port: ${port}');
});
