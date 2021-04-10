const express = require('express')
const Author = require('./../models/author')
const router = express.Router()
//All authors route
router.get('/',async (req,res)=>{
  
    let searchOption = {}
    
    if(req.query.name != null && req.query.name !== ''){

        searchOption.name = new RegExp(req.query.name,'i') 
        console.log(searchOption.name)
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
         res.redirect('authors')
    }
    catch{
        res.render('authors/new',{
            author:author,
            errorMessage: "Error creating Author"
        })
    }
  
       
})
module.exports = router