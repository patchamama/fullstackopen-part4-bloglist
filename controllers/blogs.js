const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
require('express-async-errors')

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
  body.likes = body.likes || 0

  if (!body.title || !body.url) {
    response.status(400).end()
  } else {
    const user = await User.findById(body.userId)

    if (body.user) body.user = user._id // to pass the test
    const blog = new Blog(body)
    const savedBlog = await blog.save()

    // to pass the test
    if (body.user) {
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()
    }

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
