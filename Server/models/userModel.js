const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Provide the Value for Name:'],

    },
    email:{
        type: String,
        required: [true, 'Provide the Value for Email:'],

    },
    password:{
        type: String,
        required: [true, 'Provide the Password:'],

    },
    avatar: {
        type: String
    },
    posts: {
        type: Number,
        default: 0
    }

})

module.exports = mongoose.model('User', userSchema)