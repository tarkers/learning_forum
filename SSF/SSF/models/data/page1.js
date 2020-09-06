const mongoose = require('mongoose')
const page_model = mongoose.model('page1', mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    include: {
        type: String,
        required: true
    }
}))

module.exports=page_model;