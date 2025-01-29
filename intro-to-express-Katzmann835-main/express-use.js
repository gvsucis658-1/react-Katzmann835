//This creates an js file which can run the static and dymamic websites
//Running the static webpage:
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/New-website.html');
})

app.get('/new-web.css', (req, res) => {
    res.sendFile(__dirname + '/new-web.css');
})

app.get('/map-of-oregon-cities.jpeg', (req, res) => {
    res.sendFile(__dirname + '/map-of-oregon-cities.jpeg');
})

app.get('/israel_map.jpeg', (req, res) => {
    res.sendFile(__dirname + '/israel_map.jpeg');
})

app.get('/Costa-Rica-Map.jpeg', (req, res) => {
    res.sendFile(__dirname + '/Costa-Rica-Map.jpeg');
})

app.get('/Alaska_map-L.jpeg', (req, res) => {
    res.sendFile(__dirname + '/Alaska_map-L.jpeg');
})

app.get('/Hawaii-map-M.jpeg', (req, res) => {
    res.sendFile(__dirname + '/Hawaii-map-M.jpeg');
})

app.listen(port, () => {
    console.log('Server listening on port${port}')
})


//Running the dynamic webpage: