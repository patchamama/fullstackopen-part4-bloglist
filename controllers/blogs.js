const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
require('express-async-errors')

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  // Authentication is required
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  body.likes = body.likes || 0

  if (!body.title || !body.url) {
    response.status(400).end()
  } else {
    body.user = user._id
    const blog = new Blog(body)
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = await Blog.findById(request.params.id)
  if (blog) {
    for (const key in body) {
      blog[key] = body[key]
    }
    // console.log(blog)
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
      new: true,
    })
    response.status(200).json(updatedBlog)
  }
})

module.exports = blogsRouter
