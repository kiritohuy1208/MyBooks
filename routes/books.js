const express = require('express')
const router = express.Router()

const Book = require('./../models/book')
const Author = require('./../models/author')

const imageMimeTypes = ['image/jpeg','image/png','image/gif']

// const upload = multer({
//     dest: uploadPath,
//     fileFilter:(req,file,callback)=>{
//         callback(null,imageMimeType.includes(file.mimetype))
//     } 
// })


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


router.post('/',  async (req, res) => {
    const book = new Book({
      title: req.body.title,
      author:req.body.Author.trim() ,
      publishDate: new Date(req.body.publishDate),
      pageCount: req.body.pageCount,
      description: req.body.description
    }
)
saveCover(book,req.body.cover)
try{
    const newbook = await book.save()
    //res.redirect(`/books/${newbook.id}`)
    res.redirect('/books')
}
catch(err){
    renderNewPage(res,book,true)
}
})


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
//Lưu hình ảnh của sách thông qua FileEncode của FIlePond, res.body.cover đã đc encode thoe chuẩn FileEncode
function saveCover(book,coverEncoded){
    if(coverEncoded == null ) return 
    const cover = JSON.parse(coverEncoded)
    if( cover != null && imageMimeTypes.includes(cover.type)){
        book.coverImage = new Buffer.from(cover.data,'base64') 
        book.coverImageType = cover.type
    }
}
module.exports = router