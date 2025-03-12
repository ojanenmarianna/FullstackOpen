import { useState } from 'react'

const Blog = ({ blog, updateBlog, handleRemove, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }

  const label = visible
    ? 'hide' : 'view'

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const addLike = (event) => {
    event.preventDefault()
    updateBlog({
      id: blog.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes,
      user: blog.user
    })
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author} <button onClick={toggleVisibility}>{label}</button>
      <div style={showWhenVisible}>
        {blog.url} <br></br>
        likes {blog.likes} <button onClick={addLike}>like</button><br></br>
        {blog.user.name} <br></br>
        {blog.user.name === user.name &&
          <button onClick={() => handleRemove(blog.id)}>remove</button>
        }

      </div>
    </div>
  )}

export default Blog