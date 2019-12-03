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

server.get('/api/users', (req, res) => {
    db.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            console.log('error on GET /api/users', err);
            res.status(500).json({ error: "The users information could not be retrieved." })
        });
})

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;

    db.findById(id)
        .then(user => {
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            }

        })
        .catch(err => {
            console.log(`error on GET /api/users/${id}`, err);
            res.status(500).json({ error: "The user information could not be retrieved." })
        });
})

server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;

    db.remove(id)
        .then(user => {
            if (user) {
                res.status(200).json({ message: 'user removed successfully' })
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            }
        })
        .catch(err => {
            console.log('error on DELETE /api/users/:id', err);
            res.status(500).json({ error: "The user could not be removed" })
        });
})

server.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const userData = req.body;

    if (!userData.name || !userData.bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    } else {
        db.update(id, userData)
            .then(user => {
                if (user) {
                    db.findById(id)
                        .then(user => {
                            res.status(200).json(user);
                        })
                        .catch(err => {
                            console.log(`error on GET /api/users/${id}`, err);
                            res.status(500).json({ error: "The user information could not be retrieved." })
                        })
                } else {
                    res.status(404).json({ message: "The user with the specified ID does not exist." })
                }
            })
            .catch(err => {
                console.log('error on PUT /api/users/:id', err);
                res.status(500).json({ error: "The user information could not be modified." })
            });
    }

})