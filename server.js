const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const auth = require('./routes/auth')
const userscoins = require('./routes/userscoins')
const middlewares = require('./config/middlewares')

const app = express()
app.use(cors())
app.use(express.json())
app.use(middlewares.checkTokenSetUser)

//DB Config/Connection
const db = require('./config/keys').mongoURI
mongoose.connect(db, { useNewUrlParser: true })
    .then(res => {
        console.log('DB connected...');
    })
    .catch(error => {
        console.log(error);
    })


app.get('/', (req, res) => {
    res.json({
        message: 'test',
        user: req.user
    })
})

// Use Routes
app.use('/auth', auth)
app.use('/userscoins', userscoins)

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
