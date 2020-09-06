const mongoose = require('mongoose')
const page_model = mongoose.model('ps', mongoose.Schema({
    type: {
        type: String,
        required: true
    }
}))

module.exports=page_model;