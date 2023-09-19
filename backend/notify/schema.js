const mongoose = require('mongoose');
const MyNotifiesSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    appliesNotifies:[],
    myDeclineds:[],
    rejectedsList:[],
    welcomeMessage:[],   
}) 

const MyNotifies = mongoose.model('MyNotifies',MyNotifiesSchema)
module.exports = MyNotifies