import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = () =>
  axios.get(baseUrl).then(res => res.data)

export const createAnecdote = async (anecdote) => {
  console.log(anecdote.content.length)
  if (anecdote.content.length < 5) {
    throw new Error('Anecdote content must be at least 5 characters long')
  }
  const response = await axios.post(baseUrl, anecdote)
  return response.data
}

export const updateAnecdote = async (anecdote) => {
  const response = await axios.put(`${baseUrl}/${anecdote.id}`, anecdote)
  return response.data
}