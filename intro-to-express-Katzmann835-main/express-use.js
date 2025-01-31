//This creates an js file which can run the static and dymamic websites
//Running the static webpage:
const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/New-website.html');
});

app.get('/new-web.css', (req, res) => {
    res.sendFile(__dirname + '/new-web.css');
});

app.get('/map-of-oregon-cities.jpeg', (req, res) => {
    res.sendFile(__dirname + '/map-of-oregon-cities.jpeg');
});

app.get('/israel_map.jpeg', (req, res) => {
    res.sendFile(__dirname + '/israel_map.jpeg');
});

app.get('/Costa-Rica-Map.jpeg', (req, res) => {
    res.sendFile(__dirname + '/Costa-Rica-Map.jpeg');
});

app.get('/Alaska_map-L.jpeg', (req, res) => {
    res.sendFile(__dirname + '/Alaska_map-L.jpeg');
});

app.get('/Hawaii-map-M.jpeg', (req, res) => {
    res.sendFile(__dirname + '/Hawaii-map-M.jpeg');
});

//Running the dynamic webpage:

app.get('/Dynamic-web', (req, res) => {
    const data = {
        weather: 'Finding the Weather',
        traveling: 'traveling',
        temp: ['45', '55', '66', '3', '77'],
        dist: ['2281.9', '6084', '3639.7', '2989', '4291']
    }
    res.render('Dynamic-web', data);
});

app.post('/submit', (req, res) => {
    const data = {
        weather: 'The weather is:',
        traveling: 'The travel distance is:',
        temp: ['45', '55', '66', '3', '77'],
        dist: ['2281.9', '6084', '3639.7', '2989', '4291']
    }
    res.render('Dynamic-web', data);
})

app.listen(port, () => {
    console.log('Server listening on port${port}')
});