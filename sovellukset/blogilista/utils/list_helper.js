const dummy = (blogs) => {
    return 1
  }
  
const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}


const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
      return null
    }
  
    return blogs.reduce((fav, blog) => {
      return blog.likes > fav.likes ? blog : fav
    }, blogs[0])
  }
  

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const authorCounts = {}

  blogs.forEach((blog) => {
    authorCounts[blog.author] = (authorCounts[blog.author] || 0) + 1
  })

  let maxAuthor = null
  let maxBlogs = 0

  for (const author in authorCounts) {
    if (authorCounts[author] > maxBlogs) {
      maxAuthor = author
      maxBlogs = authorCounts[author]
    }
  }

  return {
    author: maxAuthor,
    blogs: maxBlogs,
  }
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}
  