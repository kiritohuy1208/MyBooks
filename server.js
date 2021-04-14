const express = require('express')
const app = express()
const expressLayout = require('express-ejs-layouts')
const mogoose = require('mongoose')
const methodOverrride = require('method-override')
const dotenv = require('dotenv')
dotenv.config()

mogoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true

}).then(()=>console.log("MongoDb connected"))
.catch((e)=>console.log(e.message))
const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')

app.set('view engine',"ejs")
app.set('views',__dirname + '/views')
app.set('layout', 'layouts/layout')

app.use(expressLayout)
app.use(express.static('public'))
app.use(methodOverrride('_method'))
app.use(express.json())
app.use(express.urlencoded({
    limit: '10mb',
    extended:true
}))
app.use('/',indexRouter)
app.use('/authors',authorRouter)
app.use('/books',bookRouter)






const Port = process.env.PORT || 3000
app.listen(Port,()=>{
    console.log("App use on port:",Port)
})