const express = require('express');
const Joi = require('joi')

const router = express.Router();
const Coins = require('../models/coins')

const schema = Joi.object().keys({
    name: Joi.string().regex(/(^[a-zA-Z\s]+$)/).required(),
    price: Joi.string().required(),
    amount: Joi.string().required(),
    symbol: Joi.string().required(),
    percent: Joi.string().required()
})

router.get('/', (req, res) => {
    Coins.find({
        id: req.user._id
    }).then(coins => {
        var totals = []
        var percentTotals = []
        for(x in coins) {
            const floatTotals = (parseFloat((coins[x].total).replace(/,/g, '')))
            const percentFloats = (parseFloat((coins[x].percent)))
            percentTotals.push(percentFloats)
            totals.push(floatTotals)
        }
        const arrSum = totals.reduce((a,b) => a + b, 0).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        const percentTotal = percentTotals.reduce((a,b) => a + b, 0).toFixed(2)
        res.json({
            coins: coins,
            allTotal: arrSum,
            percents: percentTotal
        })
    })
})

router.post('/', (req, res, next) => {
    const result = Joi.validate(req.body, schema)
    const newTotal = ((parseFloat((req.body.price).replace(/,/g, '')))*(parseFloat(req.body.amount))).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    if(result.error === null) {
        const newCoin = new Coins ({
            name: req.body.name,
            price: req.body.price,
            amount: req.body.amount,
            symbol: req.body.symbol,
            percent: req.body.percent,
            total: newTotal,
            id: req.user._id
        })
        newCoin.save().then(theirCoin => {
            res.json(theirCoin)
        })
    } else {
        const error = new Error('incorrect format')
        res.status(422)
        next(error)
    }
    
})

module.exports = router;