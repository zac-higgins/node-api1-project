const express = require('express');
const db = require('./data/db.js');
const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send('It\'s working!!')
});

const port = 5000;
server.listen(port, () => {
    console.log(`\n ** API running on port ${port} ** \n`)
})

server.post('/api/users', (req, res) => {
    const userData = req.body;

    if (!userData.name || !userData.bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    } else {
        db.insert(userData)
            .then(user => {
                res.status(201).json({ message: "user added successfully" })
            })
            .catch(err => {
                console.log('error on POST /api/users', err);
                res.status(500).json({ error: "There was an error while saving the user to the database" })
            })

    }
})

