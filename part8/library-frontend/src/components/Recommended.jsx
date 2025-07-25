import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'

const Recommended = () => {
  const meResult = useQuery(ME)
  const booksResult = useQuery(ALL_BOOKS)

  if (meResult.loading || booksResult.loading) return <p>Loading...</p>

  const favoriteGenre = meResult.data.me.favoriteGenre
  const books = booksResult.data.allBooks

  const filteredBooks = books.filter(book =>
    book.genres.includes(favoriteGenre)
  )

  return (
    <div>
      <h2>Recommended books</h2>
      <p>
        Books in your favorite genre <strong>{favoriteGenre}</strong>
      </p>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map(book => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommended
