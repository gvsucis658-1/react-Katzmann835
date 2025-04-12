const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const e = require('express');
const Application = express();
const path = require('path');
const port = 3001;

Application.use(cors());
Application.use(express.json());

Application.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
            console.log("ERROR");
            return;
        }
        res.json({App: rows});
    });
});

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const newImage = multer({storage: storage});

Application.post('/Main', newImage.single('image'), async (req, res) => {
    if (!req.file){
        return res.status(400).json({error: 'No Imagefile has been found'});
    }
    const imageURL = `./uploads/${req.file.filename}`;

    console.log('Image uploaded:', imageURL);
    return res.status(200).json({
        message: 'Image sucessfully uploaded',
        filename: req.file.filename,
        imageURL: imageURL
    });
});


Application.post('/Register', async (req, res) => {
    const {username, password} = req.body;

    db.get('SELECT * FROM Users WHERE username = ?', [username], async (err, findUser) => {
        if(findUser){
            return res.status(400).send({message: "Username already exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run('INSERT INTO Users(username, hashedPassword) VALUES(?, ?)', [username, hashedPassword], function(err) {
            if (err){
                return res.status(400).send({error: err.message});
            }
            res.status(200).json({message: 'Register success!'});
        });
    });
});

Application.post('/App', async (req, res) => {
    const { new_obj, username, password } = req.body;
    db.get('SELECT * FROM Users WHERE username = ?', [username], async (err, newUser) => {
        if (err) {
            console.log(err);
            return res.status(400).send({error: err.message});
        }
        if (!newUser) {
            console.log(newUser);
            return res.status(400).json({message: 'Login Failed'});
        }
        const newPassword = await bcrypt.compare(password, newUser.hashedPassword);
        if(!newPassword){
            return res.status(400).json({message: 'Login Failed, incorrect password'});
        }
        const token = jwt.sign({userId: newUser.id}, 'new_key', {expiresIn: '30m'});
        db.run('INSERT INTO App(name) VALUES(?)', [new_obj], function(err){
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