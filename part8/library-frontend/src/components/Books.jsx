import { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = () => {
  const [getBooks, { data, loading }] = useLazyQuery(ALL_BOOKS)
  const [selectedGenre, setSelectedGenre] = useState(null)

  const genres = ['patterns', 'refactoring', 'design', 'agile', 'classic']

  useEffect(() => {
    getBooks({ 
      variables: { genre: selectedGenre },
      fetchPolicy: 'network-only'
    })
  }, [selectedGenre])

  if (loading) return <div>loading...</div>

  const books = data?.allBooks || []

  return (
    <div>
      <h2>Books</h2>
      {selectedGenre && <p>in genre <b>{selectedGenre}</b></p>}

      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {genres.map((g) => (
          <button key={g} onClick={() => setSelectedGenre(g)}>
            {g}
          </button>
        ))}
        <button onClick={() => setSelectedGenre(null)}>all genres</button>
      </div>
    </div>
  )
}

export default Books
