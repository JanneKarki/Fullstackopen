import { useState } from 'react'

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  if (!visible) {
    return (
      <div className="blog">
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
    )
  }

  return (
    <div className="blog">
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>hide</button>
      </div>
      <div>{blog.url}</div>
      <div>
        likes {blog.likes} <button>like</button>
      </div>
      <div>{blog.user?.name}</div>
    </div>
  )
}

export default Blog
