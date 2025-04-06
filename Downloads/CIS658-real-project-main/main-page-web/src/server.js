const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const e = require('express');
const Application = express();
const port = 3001;
const newUsers = [];

Application.use(cors());
Application.use(express.json());

const db = new sqlite3.Database('./appdb.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the sqlite3 database');
});
db.run('CREATE TABLE IF NOT EXISTS App (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');
db.run('CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, hashedPassword TEXT)');

Application.get('/App', (req, res) => {
    db.all('SELECT * FROM App', [], (err, rows) => {
        if (err) {
            res.status(400).send({error: err.message});
            return;
        }
        res.json({App: rows});
    });
});

const newImage = multer({
    dest: './uploads'
}).single('image');

Application.post('/Main', async (req, res) => {
    newImage(req, res, (err) => {
        if (err) {
            console.error('Image failed to upload', err);
            return res.status(400).json({error: 'Image failed to upload'});
        }

        console.log('Image uploaded:', req.file);
        return res.status(200).json({
            message: 'Image sucessfully uploaded',
            filename: req.file.filename
        });
    });
});


Application.post('/Register', async (req, res) => {
    const {username, password} = req.body;

    const findUser = newUsers.find((newUser) => newUser.username === username);
        if (findUser){
            return res.status(400).send({message: "Username already exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        newUsers.push({username, password: hashedPassword});

        res.status(200).json({message: 'Register success!'});
});

Application.post('/App', async (req, res) => {
    const { new_obj, username, password } = req.body;

    db.get('SELECT * FROM Users WHERE username = ?', [username], async (err, newUser) => {
        if (err) {
            return res.status(400).send({error: err.message});
        }
        if (!newUser) {
            return res.status(400).json({message: 'Login Failed'});
        }
        const newPassword = await bcrypt.compare(password, newUser.hashedPassword);
        if(!newPassword){
            return res.status(400).json({message: 'Login Failed, incorrect password'});
        }
        const token = jwt.sign({userId: newUser.id}, 'new_key', {expiresIn: '30m'});
        db.run('INSERT INTO App(new_obj) VALUES(?)', [new_obj], function(err){
        if (err) {
            return res.status(400).send({error: err.message});
        }
        res.status(200).json({message: 'Login success!', token: token, id: this.lastID});
        });
    });
});

Application.delete('/App/:id', (req, res) => {
    db.run('DELETE FROM App WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            res.status(400).send({error: err.message});
            return;
        }
        res.json({changes: this.changes})
    });
});

Application.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});