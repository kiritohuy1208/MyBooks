const express = require('express')
const Author = require('./../models/author')
const router = express.Router()
const Book = require('./../models/book')
//All authors route
router.get('/',async (req,res)=>{
  
    let searchOption = {}
    
    if(req.query.name != null && req.query.name !== ''){

        searchOption.name = new RegExp(req.query.name,'i') 
       
    }
    try{
        const authors = await Author.find(searchOption)
        res.render('authors/index',{authors: authors,searchOption:req.query})
    }
    catch{
        res.redirect('/')
    }
    
   
})
//New author route
router.get('/new',(req,res)=>{
    res.render('authors/new',{author:new Author()})
})
//Cretae new author
router.post('/', async (req,res)=>{
    const author = new Author({
        name: req.body.name
    })
    try{
        const newAuthor = await author.save()
         res.redirect(`authors/${newAuthor.id}`)
    }
    catch{
        res.render('authors/new',{
            author:author,
            errorMessage: "Error creating Author"
        })
    }     
})
router.get('/:id', async (req,res)=>{
    try{
        const author = await Author.findById(req.params.id)
        const bookByAuthor = await Book.find({author:author.id}).limit(6).exec()
        res.render('authors/show.ejs',{author: author, bookByAuthor: bookByAuthor})
    }
    catch(err){
        console.log(err)
        res.redirect('/')
    }
})
router.get('/:id/edit', async (req,res)=>{
    try{
        const author = await Author.findById(req.params.id)
        res.render('authors/edit',{author:author})
    }
    catch{
        res.redirect('/authors')
    }
   
})
router.put('/:id', async (req,res)=>{
    //  khai bao author ben ngoai nham su dung cho ham catch va type la let de thay doi content author
   let author 
    try{
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)
    }
    // do co the co loi hay lan : 1: tim kiem author loi 2: save author bi loi
    catch{
        // ham xu ly khi  tim kiem author loi:
        if( author == null){
            // redirect den trang chu
            res.redirect('/')
        }else{
            res.render('authors/edit',{
                author:author,
                errorMessage: "Error updating Author"
            })
        }
       
    }     
})
router.delete('/:id', async (req,res)=>{
    let author
    try{
        author= await Author.findById(req.params.id)
        await author.remove()
        res.redirect('/authors')
    }
    catch{
        if(author ==null){
            res.redirect('/')
        }else{
            res.redirect(`/authors/${author.id}`)
        }
    }
})
module.exports = router