const express = require('express')
const router = express.Router()

const Book = require('./../models/book')
const Author = require('./../models/author')
const { json } = require('express')

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
//get Detail book
router.get('/:id',async (req,res)=>{
    try{
        const book = await Book.findById(req.params.id).populate('author').exec()
        res.render('books/show.ejs',{book:book})
    }
    catch(err){
        console.log(err)
        res.redirect('/')
    }
   
})
router.get('/:id/edit',async (req,res)=>{
    try{
        const book = await Book.findById(req.params.id)
        
        renderEditPage(res,book)
    }
    catch{
        res.redirect('/')
    }
   
})
router.post('/',  async (req, res) => {

    var imagesarray = req.body.cover
    let arr = []
    var i=0
    while(imagesarray[i] !== undefined){
    var image= JSON.parse(imagesarray[i])
    arr.unshift(image)
    i++
    }

    const book = new Book({
      title: req.body.title,
      author:req.body.Author.trim() ,
      publishDate: new Date(req.body.publishDate),
      pageCount: req.body.pageCount,
      description: req.body.description
    })
    // Lưu 1 hình
    // saveCover(book,req.body.cover)

    // Lưu nhiều hình
    saveArrayImage(book,arr,i)

    try{
        const newbook = await book.save()
        res.redirect(`/books/${newbook.id}`)
    }
    catch(err){
        console.log(err)
        renderNewPage(res,book,true)
        
    }

})
router.put('/:id',  async (req, res) => {
   let book
    try{
       book = await Book.findById(req.params.id)
       book.title = req.body.title
       book.author = req.body.Author.trim()
       book.publishDate = new Date(req.body.publishDate) 
       book.pageCount = req.body.pageCount
       book.description = req.body.description
        if(req.body.cover !=null && req.body.cover !==''){
            saveCover(book,req.body.cover)
        }
        await book.save()
        res.redirect(`/books/${book.id}`)   
    }
    catch(err){
        console.log(err)
        //Kiem tra loi nhung da tao book thanh cong=> loi do save len db
        if( book != null){
            renderEditPage(res,book,true)
        }
        // Loi do book= null 
        else{ 
            
            redirect('/')
        }
       
    }

})

router.delete('/:id', async (req,res)=>{
    let book 
    try{
        book= await Book.findById(req.params.id)
        await book.remove()
        res.redirect('/books')
    }
    catch(err){
        console.log(err);
        if( book != null){
            res.redirect('books/show',{book:book, errorMessage:" Could not remove book"})
        }
        else{
            res.redirect('/')
        }
    }
})

async function renderNewPage(res, book , checkError = false){
    renderFormPage(res,book,'new',checkError)
}

async function renderEditPage(res, book , checkError = false){
   renderFormPage(res,book,'edit',checkError)
}
async function renderFormPage(res, book ,form, checkError = false){
    try{
        const authors = await Author.find()
        const params={
            authors: authors,
            book: book
        }
        if(checkError){
            if(form === 'edit'){
                params.errorMessage = "Error updating book"
            }
            else{
                params.errorMessage = "Error creating book"
            }
        }

        res.render(`books/${form}`,params)
    }
    catch{
        res.redirect('/books')
    }
}
//Lưu hình ảnh của sách thông qua FileEncode của FIlePond, res.body.cover đã đc encode thoe chuẩn FileEncode
function saveCover(book,coverEncoded){
    if(coverEncoded == null ) {
        return }
    
     const cover = JSON.parse(coverEncoded)
        if( cover != null && imageMimeTypes.includes(cover.type)){
            
            book.coverImage = new Buffer.from(cover.data,'base64') 
            book.coverImageType = cover.type
        
    }
   

}
async function saveArrayImage(book,arr,length){
  
    if(arr == null) return
    for(i=0;i<length;i++ ){
        if( arr[i] != null && imageMimeTypes.includes(arr[i].type)){
            var image = {
                coverImage:  new Buffer.from(arr[i].data,'base64') ,
                coverImageType: arr[i].type
            }
           
            book.arrayImage[i] = image
           
           
    }
           
    }
}
//  <% book.arrayImage.forEach(img =>{%> 
// data:<%= img.coverImageType%>;charset=utf-8;base64,<%= img.coverImage.toString('base64')%>
//  <%})%>
module.exports = router