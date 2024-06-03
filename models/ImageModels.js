const mongoose = require("mongoose")

const ImageSchema = mongoose.Schema({
    name:{
        type:String,
        required:false,
    },

    image:{
        data: Buffer,
        contentType:String
    }

})

const Image = mongoose.model('new_Image', ImageSchema);
module.exports = Image