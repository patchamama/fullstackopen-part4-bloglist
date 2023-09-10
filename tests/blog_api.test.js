const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog))
  const promiseArray = blogObjects.map((blog) => blog.save())
  await Promise.all(promiseArray)

  // for (let blog of helper.initialBlogs) {
  //   let blogObject = new Blog(blog)
  //   await blogObject.save()
  // }
})

describe('when there is initially some blogs saved', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)

  test('all notes are returned', async () => {
    const response = await api.get('/api/blogs')
    //   console.log(response.body)
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/blogs')
    //   console.log(response.body[0])

    const contents = response.body.map((r) => r.title)
    //   console.log(contents)
    expect(contents).toContain('El tortuoso camino de la justicia transicional')
  })
})

describe('viewing a specific blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Fugas o la ansiedad de sentirse vivo',
      author: 'A. Pacheco',
      url: 'https://unlibroenmimochila.blogspot.com/2017/12/fugas-o-la-ansiedad-de-sentirse-vivo.html',
      likes: 4,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    // const contents = response.body.map((r) => r.title)

    const blogsAtEnd = await helper.blogsInDb()
    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map((n) => n.title)
    expect(contents).toContain('Fugas o la ansiedad de sentirse vivo')
  })

  test('check if the get id is correct', async () => {
    const blogsAtStart = await helper.blogsInDb()
    let blogToCheck = blogsAtStart[0]

    const response = await api
      .get(`/api/blogs/${blogToCheck.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toEqual(blogToCheck)
  })

  test('fails with statuscode 404 if blog does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api.get(`/api/blogs/${validNonexistingId}`).expect(404)
  })

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = '5a3d5da59220081a82a3445'

    await api.get(`/api/blogs/${invalidId}`).expect(400)
  })

  test('unique identifier property of the blog posts is named id,', async () => {
    const response = await api.get('/api/blogs')
    const contents = response.body[0]
    //   console.log(contents)
    expect(contents.id).toBeDefined()
  })

  test('if the likes property is missing from the request, it will default to the value 0', async () => {
    const newBlog = {
      title: 'Fugas o la ansiedad de sentirse vivo',
      author: 'A. Pacheco',
      url: 'https://unlibroenmimochila.blogspot.com/2017/12/fugas-o-la-ansiedad-de-sentirse-vivo.html',
    }
    //   const response = await api.post('/api/blogs').send(newBlog)
    let blogObject = new Blog(newBlog)
    try {
      const response = await blogObject.save()
      expect(response.likes).toBe(0)
    } catch (error) {
      console.log(error)
    }
  })

  test('if the title or url are missing from the request data, the backend responds 400 Bad Request', async () => {
    // url is missing
    let response = await api.post('/api/blogs').send({
      title: 'test title',
      author: 'A. Pacheco',
      likes: 4,
    })
    expect(response.status).toBe(400)

    // title is missing
    response = await api.post('/api/blogs').send({
      author: 'A. Pacheco',
      likes: 4,
      url: 'https://unlibroenmimochila.blogspot.com/2017/12/fugas-o-la-ansiedad-de-sentirse-vivo.html',
    })
    expect(response.status).toBe(400)

    // both are missing (title and url)
    response = await api.post('/api/blogs').send({
      author: 'A. Pacheco',
      likes: 4,
    })
    expect(response.status).toBe(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    //   expect(response.body).toHaveLength(initialBlogs.length)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const contents = blogsAtEnd.map((r) => r.title)

    expect(contents).not.toContain(blogToDelete.title)
  })
})

describe('updating of a blog entry', () => {
  test('succeeds with status code 200 with likes update', async () => {
    const blogsAtStart = await helper.blogsInDb()
    let blogToUpdate = blogsAtStart[0]
    blogToUpdate.likes = 100

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const contents = blogsAtEnd.map((r) => r.likes)

    expect(contents).toContain(blogToUpdate.likes)
  })

  test('succeeds with status code 200 title and url update', async () => {
    const blogsAtStart = await helper.blogsInDb()
    let blogToUpdate = blogsAtStart[0]
    blogToUpdate.title = 'test title'
    blogToUpdate.url = 'test url'

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const contents = blogsAtEnd.map((r) => r.title)
    expect(contents).toContain(blogToUpdate.title)

    const contents2 = blogsAtEnd.map((r) => r.url)
    expect(contents2).toContain(blogToUpdate.url)
  })
})

test('unknown endpoint in api url', async () => {
  const response = await api.get('/api/blogs-url-dont-exist')
  //   console.log(response.body)

  expect(response.body.error).toBe('unknown endpoint')
})

afterAll(async () => {
  await mongoose.connection.close()
})
