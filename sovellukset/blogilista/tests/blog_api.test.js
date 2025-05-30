const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
    {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
      },
      {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
      },
      {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
      },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})
after(async () => {
    await mongoose.connection.close()
})

describe('Saved blogs are valid', () => {
    test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('correct amount of blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
    })


    test('unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')

    const blog = response.body[0]
    assert.ok(blog.id) // Check that 'id' exists
    assert.strictEqual(blog._id, undefined)
    })
})

describe('Adding a new blog', () => {
    const newBlog = {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
    }
  
    test('blog count increases by one', async () => {
      const blogsAtStart = await api.get('/api/blogs')
  
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
  
      const blogsAtEnd = await api.get('/api/blogs')
      assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length + 1)
    })
  
    test('the added blog content is correct', async () => {
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
  
      const blogsAtEnd = await api.get('/api/blogs')
      const titles = blogsAtEnd.body.map(blog => blog.title)
  
      assert(titles.includes(newBlog.title))
    })
  })
  
  