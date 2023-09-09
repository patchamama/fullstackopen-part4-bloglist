const listHelper = require('../utils/list_helper')

const bigbloglist = [
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
]

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const blogs = []
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const blogs = [
      {
        _id: '23234323242dssfsf',
        title: 'Test 2nd blog title',
        author: 'Test of blog author',
        url: 'Test of blog url ',
        likes: 6,
      },
    ]
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(6)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(bigbloglist)
    expect(result).toBe(36)
  })
})

describe('favorites', () => {
  test('Most favorite with empty list', () => {
    const blogs = [{}]
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual({})
  })

  test('Most favorite with one value', () => {
    const blogs = [
      {
        _id: '23234323242dssfsf',
        title: 'Test 2nd blog title',
        author: 'Test of blog author',
        url: 'Test of blog url ',
        likes: 6,
      },
    ]
    const result = listHelper.favoriteBlog(blogs)
    expect(result.likes).toBe(6)
    expect(result).toEqual(blogs[0])
  })

  test('Most favorite with a big list', () => {
    const result = listHelper.favoriteBlog(bigbloglist)
    expect(result).toEqual(bigbloglist[0])
    expect(result.likes).toEqual(12)
  })
})

describe('Authors with more blogs', () => {
  test('More blogs with empty list', () => {
    const blogs = [{}]
    const result = listHelper.mostBlogs(blogs)
    console.log(result)
    expect(result).toEqual({ author: undefined, entries: 1 })
  })
  test('More blogs with one element in the list', () => {
    const blogs = [
      {
        _id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
        __v: 0,
      },
    ]
    const result = listHelper.mostBlogs(blogs)
    console.log(result)
    expect(result).toEqual({ author: 'Robert C. Martin', entries: 1 })
  })
  test('More blogs with big list', () => {
    const result = listHelper.mostBlogs(bigbloglist)
    console.log(result)
    expect(result).toEqual({ author: 'Robert C. Martin', entries: 3 })
  })
})

describe('Authors with more likes', () => {
  test('--- with empty list', () => {
    const blogs = [{}]
    const result = listHelper.mostLikes(blogs)
    console.log(result)
    expect(result).toEqual({ author: undefined, likes: undefined })
  })

  test('--- with one blog list', () => {
    const blogs = [
      {
        _id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
        __v: 0,
      },
    ]
    const result = listHelper.mostLikes(blogs)
    console.log(result)
    expect(result).toEqual({ author: 'Robert C. Martin', likes: 2 })
  })
  test('--- with big blog list', () => {
    const result = listHelper.mostLikes(bigbloglist)
    console.log(result)
    expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 17 })
  })
})
