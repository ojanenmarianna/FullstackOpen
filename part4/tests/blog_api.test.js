const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const Blog = require('../models/blog')
const helper = require('../utils/test_helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

describe('GET /api/blogs', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('there are two blogs', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, 2)
    })

    test('returned blogs have id field', async () => {
        const response = await api.get('/api/blogs')
        response.body.forEach(blog => {
            assert.ok(blog.id !== undefined)
        })
    })

    test('a specific blog can be viewed', async () => {
        const blogsAtStart = await helper.blogsInDb()
      
        const blogToView = blogsAtStart[0]
      
        const resultBlog = await api
            .get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
      
        assert.deepStrictEqual(resultBlog.body, blogToView)
    })
})

describe('addition of a blog', () => {
    test('a valid blog can be added ', async () => {
        const newBlog = {
            title: 'First class tests',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
            likes: 10
        }
        
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const response = await api.get('/api/blogs')
        
        const title = response.body.map(r => r.title)
        
        assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
        
        assert(title.includes('First class tests'))
    })

    test('blog without title is not added', async () => {
        const newBlog = {
            autho: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
            likes: 10
        }
        
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
      
        const response = await api.get('/api/blogs')
      
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })
        
    test('blog without author is not added', async () => {
        const newBlog = {
            title: 'First class tests',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
            likes: 10
        }
        
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
      
        const response = await api.get('/api/blogs')
      
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('blog without url is not added', async () => {
        const newBlog = {
            title: 'First class tests',
            author: 'Robert C. Martin',
            likes: 10
        }
        
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
      
        const response = await api.get('/api/blogs')
      
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('blog without likes has default likes of zero', async () => {
        const newBlog = {
            title: 'First class tests',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        }
        
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
      
        const response = await api.get('/api/blogs')
        const addedBlog = response.body.find(blog => blog.title === newBlog.title)
      
        assert.strictEqual(addedBlog.likes, 0)
    })
})

describe('deletion of a blog', () => {
    test('a note can be deleted', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        const titles = blogsAtEnd.map(r => r.title)
        assert(!titles.includes(blogToDelete.title))

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
})

describe('updating a blog', () => {
    test('updating likes of an existing blog', async () => {
        const blogsAtStart = await helper.blogsInDb()
      
        const blogToUpdate = blogsAtStart[0]

        const newBlog = {
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 10
        }
        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const updatedBlogResponse = await api.get(`/api/blogs/${blogToUpdate.id}`)
        const updatedBlog = updatedBlogResponse.body

        assert.strictEqual(updatedBlog.likes, 10)
    })
})

after(async () => {
    await mongoose.connection.close()
})