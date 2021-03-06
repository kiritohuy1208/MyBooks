const mongoose = require("mongoose")
const path = require('path')
const coverImageBasePath = 'uploads/bookCovers'
const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required : true
    },
    description:{
        type: String,
        required: true
    },
    publishDate:{
        type: Date,
        required: true
    },
    pageCount:{
        type: Number,
        required: true
    },
    createAt:{
        type: Date,
        required:true,
        default: Date.now
    },
    coverImage:{
        type: Buffer,
        // required: true
    },
    coverImageType:{
        type: String,
        // required : true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    },
    arrayImage:[
        {
            coverImage: Buffer,
            coverImageType:{ type: String}
        }
    ]
    // arrayImage:[Buffer]
})
// bookSchema.virtual('coverImagePath').get(function(){
//     if (this.coverImage != null && this.coverImageType != null) {
//         return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
//     }
// })

bookSchema.virtual('coverImagePath').get(function(){

    if (this.arrayImage[0].coverImage != null && this.arrayImage[0].coverImageType != null) {
        return `data:${this.arrayImage[0].coverImageType};charset=utf-8;base64,${this.arrayImage[0].coverImage.toString('base64')}`
    }
})
module.exports = mongoose.model('Book',bookSchema)
module.exports.coverImageBasePath =coverImageBasePath