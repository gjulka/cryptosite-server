const mongoose = require('mongoose')
const Schema = mongoose.Schema;

//User Schema
const CoinSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    symbol: {
        type: String,
        required: true
    },
    percent: {
        type: String,
        required: true
    },
    total: {
        type: String
    },
    id: {
        type: String,
        required: true
    }
})

module.exports = Coins = mongoose.model('coins', CoinSchema)