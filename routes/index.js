const express = require('express')
const router = express.Router()
const Book = require('../models/book')

router.get('/',async (req,res)=>{
    let books
    try{
        // thuc thi exec filter trong mongoos, gioi han 10 book, sap xep theo ngay tao
       books= await Book.find().sort({cretaeAt : 'desc'}).limit(10).exec()
    }
    catch{
        books = []
    }   
    res.render('index.ejs',{books:books});
})
module.exports = router