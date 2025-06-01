import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import { Notification, ErrorNotification } from './components/Notification'
import { useRef } from 'react'
import Togglable from './components/Togglable'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notify = (message, duration = 5000) => {
    setNotification(message)
    setTimeout(() => setNotification(null), duration)
  }
  
  const notifyError = (message, duration = 5000) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(null), duration)
  }
  

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
    } catch (error) {
      console.error('wrong credentials')
      notifyError('Wrong username or password')
    }
  }
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const createBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))
      notify(`a new blog "${newBlog.title}" by ${newBlog.author} added`)
      blogFormRef.current.toggleVisibility()
    } catch (error) {
      console.error('failed to create blog', error)
      notifyError('Failed to create blog')
    }
  }
  
  if (user === null) {
    return (
    <div>
      <h2>Log in to application</h2>
      <Notification message={notification} />
      <ErrorNotification message={errorMessage} />

      <LoginForm onLogin={handleLogin} />
    </div>
  )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification} />
      <ErrorNotification message={errorMessage} />

      <p>{user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
