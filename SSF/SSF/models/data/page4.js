const mongoose = require('mongoose')
const page_model = mongoose.model('page4', mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    1: {
        type: String,
        required: false
    },
    2: {
        type: String,
        required: false
    },
    3: {
        type: String,
        required: false
    },
    4: {
        type: String,
        required: false
    },
    5: {
        type: String,
        required: false
    }
}))

module.exports=page_model;