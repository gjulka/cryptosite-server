const express = require('express')
const Joi = require('joi');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const User = require('../models/users')
const router = express.Router();

const schema = Joi.object().keys({
    username: Joi.string().regex(/(^[a-zA-Z0-9_]+$)/).min(2).max(30).required(),
    password: Joi.string().min(8).required().trim()
});

function error422(res, next) {
    const error = new Error('Unable to login.')
    res.status(422)
    next(error)
}

function createTokenSendResponse(user, res, next) {
    const payload = {
        _id: user._id,
        username: user.username
    }

    jwt.sign(payload, process.env.TOKEN_SECRET, {expiresIn: '1d'}, (err, token) => {
        if (err) {
           console.log('unable to create token');
        } else {
            res.json({
                token
            })
        }
    })
}

// GET /auth/
router.get('/', (req, res) => {
    res.json({
        message: 'Router is working'
    })
})

// POST /auth/signup
router.post('/signup', (req, res, next) => {
    const result = Joi.validate(req.body, schema);
    if (result.error === null) {
        User.findOne({
            username: req.body.username
        }).then((user) => {
            if (user) {
                const userError = new Error('Username already exists. Choose another.')
                res.status(409)
                next(userError)
            } else {
                bcrypt.hash(req.body.password.trim(), 12).then(hashedPassword => {
                    const newUser = new User({
                        username: req.body.username,
                        password: hashedPassword
                    })
                    newUser.save().then(insertedUser => {
                        createTokenSendResponse(insertedUser, res, next);
                    })
                })
            }
        }).catch((e) => {
            console.log(e);
        })
    } else {
        res.status(422)
        next(result.error)
    }
})

//POST /auth/login
router.post('/login', (req, res, next) => {
    const result = Joi.validate(req.body, schema)
    if (result.error == null) {
        User.findOne({
            username: req.body.username
        }).then(user => {
            if (user) {
                //compare hashed password to password in db
                bcrypt.compare(req.body.password, user.password).then(result => {
                    if(result) {
                        createTokenSendResponse(user, res, next)
                    } else {
                        error422(res, next)
                    }
                })
            } else {
                error422(res, next)
            }
        })
    } else {
        error422(res, next)
    }
})

module.exports = router