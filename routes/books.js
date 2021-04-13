const express = require('express')
const router = express.Router()
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const Book = require('./../models/book')
const Author = require('./../models/author')


const uploadPath = path.join('public',Book.coverImageBasePath)
const imageMimeType = ['image/jpeg','image/png','image/gif']

const upload = multer({
    dest: uploadPath,
    fileFilter:(req,file,callback)=>{
        callback(null,imageMimeType.includes(file.mimetype))
    } 
})

// var storage = multer.diskStorage({
// 	destination: function (req, file, cb) {
// 	  cb(null, uploadPath)
// 	},
// 	filename: function (req, file, cb) {
// 	  cb(null, file.originalname);
// 	},
//     fileFilter:(req,file,callback)=>{
//         callback(null,imageMimeType.includes(file.mimetype))
//     } 
//   })
// var upload = multer({storage:storage})

//All Books route
router.get('/',async (req,res)=>{

    let query = Book.find()

    if(req.query.title != null && req.query.title !== ''){
      query= query.regex('title',new RegExp(req.query.title,'i'))
        
    } 
    if(req.query.publishBefore != null && req.query.publishBefore !== ''){
        query = query.lte('publishDate',req.query.publishBefore)     
      } 
    if(req.query.publishAfter != null && req.query.publishAfter !== ''){
        query = query.gte('publishDate',req.query.publishAfter)     
      } 
    try{
        //use query.exec to execute the query string, moggoose will casts filter to match schema
        const books = await query.exec()
        res.render('books/index',{books:books,searchOption:req.query});
    }
    catch{
        res.redirect('/')
    }   
})
//New Books route
router.get('/new',async(req,res)=>{
    renderNewPage(res,new Book())
})


router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    const book = new Book({
      title: req.body.title,
      author:req.body.Author.trim() ,
      publishDate: new Date(req.body.publishDate),
      pageCount: req.body.pageCount,
      coverImageName: fileName,
      description: req.body.description
    }
)
try{
    const newbook = await book.save()
    //res.redirect(`/books/${newbook.id}`)
    res.redirect('/books')
}
catch(err){
    console.log(err.message);
    if(book.coverImageName !== null){
        removeImageBookCover(book.coverImageName)
    }
    renderNewPage(res,book,true)
}
})

function removeImageBookCover(filename){
    //Use unlink to delete file follow the link
       fs.unlink(path.join(uploadPath,filename),(err)=>{
           if(err) throw err;
        //    console.log(`${path.join(uploadPath,filename)} was Deleted`)
       })
}
async function renderNewPage(res, book , checkError = false){
    try{
        const authors = await Author.find()
        const params={
            authors: authors,
            book: book
        }
        if(checkError) params.errorMessage = "Error creating book"

        res.render('books/new',params)
    }
    catch{
        res.redirect('/books')
    }
}
module.exports = router