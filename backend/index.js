const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')
const postRouter = require('./routes/post')
const commentRouter = require('./routes/comment')
const uploadRouter = require('./controllers/uploadController')
const dotenv = require('dotenv').config()
const app = express()


mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log('db connection is a success')
})

app.use('/images', express.static('public/images'))

// middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/post', postRouter)
app.use('/comment', commentRouter)
app.use('/upload', uploadRouter)

app.listen(process.env.PORT, () => console.log('Server has been connected successfully'))
