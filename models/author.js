const mongoose = require("mongoose")
const Book = require('./book')
const authorSchema = mongoose.Schema({
    name: {
        type: String,
        required : true
    }
})
//Them rang bupc truoc khi xoa tac gia
//Chay truoc 1 hanh dong nhat dinh: truoc khi xoa tac gia that, thi se thuc hien chuc nang nay:
authorSchema.pre('remove',function(next){
    Book.find({author:this.id},(err,books )=>{
        if(err){
            //Dung next de ngan can viet xoa tac gia
            next(err)
        }else if( books.length > 0){
            next(new Error('This author has books still'))
        }else{
            next()
        }
    })
})


module.exports = mongoose.model('Author',authorSchema)