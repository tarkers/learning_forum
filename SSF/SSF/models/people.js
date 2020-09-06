const mongoose = require('mongoose')
const peaple_schema = mongoose.Schema({
    ID: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true
    },
    school: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('peaple' , peaple_schema)
