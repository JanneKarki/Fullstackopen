import { useState } from 'react'

const Blog = ({ blog, onLike, onDelete, currentUser }) => {
  const [visible, setVisible] = useState(false)

  const isOwner = currentUser?.username === blog.user?.username

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
        <div>{blog.title}</div>
        <div>{blog.author}</div>
        <button onClick={toggleVisibility}>hide</button>
      </div>
      <div>{blog.url}</div>
      <div>
        likes {blog.likes} <button onClick={onLike}>like</button>
      </div>
      <div>{blog.user?.name}</div>
      {isOwner && (
        <button onClick={onDelete}>remove</button>
      )}
    </div>
  )
}

export default Blog
