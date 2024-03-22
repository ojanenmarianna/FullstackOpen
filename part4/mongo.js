/* eslint-disable no-unused-vars */

const mongoose = require('mongoose')

const url = process.env.TEST_MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url).then(() => {
    const noteSchema = new mongoose.Schema({
        content: String,
        important: Boolean,
    })

    const Blog = mongoose.model('Blog', noteSchema)

    /*
    const blogs = [
        {
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5
        },
        {
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
            likes: 12
        },
        {
            title: 'First class tests',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
            likes: 10
        }
    ]

    await Blog.insertMany(blogs)
    */

    Blog.find({}).then(result => {
        result.forEach(blog => {
            console.log(blog)
        })
        mongoose.connection.close()
    })
})