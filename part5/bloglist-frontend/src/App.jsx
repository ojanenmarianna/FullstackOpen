import { useState, useEffect, useRef } from 'react'

import './index.css'
import Blog from './components/Blog'
import Notification from './components/notifications'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogsappUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()

    await blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setSuccessMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const addLike = async (blogObject) => {
    try {
      const updatedBlog = await blogService.update(blogObject.id, {
        ...blogObject,
        likes: blogObject.likes + 1
      })

      setBlogs(blogs.map(blog => blog.id !== updatedBlog.id ? blog : {
        ...updatedBlog,
        user: blogObject.user
      }))

      setSuccessMessage(`Like added for blog "${updatedBlog.title}"`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (error) {
      console.log('Error:', error)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogsappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setSuccessMessage(`User ${user.username} successfully logged in`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('Wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    console.log('Logging out....')

    window.localStorage.removeItem(
      'loggedBlogsappUser', JSON.stringify(user)
    )

    location.reload()
  }

  const handleRemove = (id) => {
    const blogToRemove = blogs.filter((b) => b.id === id)[0]
    if (window.confirm(`Remove blog ${blogToRemove.title} by ${blogToRemove.author}`)) {
      blogService
        .remove(id)
        .then((response) => {
          setBlogs(blogs.filter(b => b.id !== id))
          setSuccessMessage(`Removed ${blogToRemove.title}`)
          setTimeout(() => setSuccessMessage(null), 4000)
        })
        .catch((error) => {
          setErrorMessage(
            `Blog ${blogToRemove.title} was already removed from server`
          )
          setTimeout(() => setErrorMessage(null), 4000)
        })
    }
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <Notification message={errorMessage} type="error" />
      <Notification message={successMessage} type="success" />

      {user === null ?
        <div>
          <h1>Log in to application</h1>
          <LoginForm handleSubmit={handleLogin}
            handleUsernameChange={event => setUsername(event.target.value)}
            handlePasswordChange={event => setPassword(event.target.value)}
            username={username}
            password={password} />
        </div> :
        <div>
          <h1>Blogs app</h1>
          <p>{user.name} logged in <button
            onClick={handleLogout}>logout
          </button>
          </p>
          <Togglable buttonLabel='create new blog' ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          <br></br>
          {sortedBlogs.map(blog => (
            <Blog key={blog.id} blog={blog} updateBlog={addLike} handleRemove={handleRemove} user={user} />
          ))}
        </div>
      }
    </div>
  )
}

export default App