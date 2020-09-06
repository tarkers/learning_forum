const mongoose = require('mongoose')
const page_model = mongoose.model('page3', mongoose.Schema({
    num: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true
    }
}))

module.exports=page_model;