import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      user: null
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <h2>Create a new blog</h2>

      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            data-testid='title'
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            id='blog-title'
          />
        </div>
        <div>
          author:
          <input
            data-testid='author'
            value={newAuthor}
            onChange={event => setNewAuthor(event.target.value)}
            id='blog-author'
          />
        </div>
        <div>
          url:
          <input
            data-testid='url'
            value={newUrl}
            onChange={event => setNewUrl(event.target.value)}
            id='blog-url'
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm