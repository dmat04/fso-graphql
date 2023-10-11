import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = () => {
  const result = useQuery(ALL_BOOKS)
  const [genre, setGenre] = useState(null)

  const genreSelector = (genre) => {
    return () => setGenre(genre)
  }

  if (result.loading) {
    return <div>loading books...</div>
  }

  const books = result.data.allBooks
  const displayBooks = genre
    ? books.filter(b => b.genres.includes(genre))
    : books

  const genres = new Set()
  books.forEach(b => {
    b.genres.forEach(g => genres.add(g))
  })

  const selectedStyle = {
    fontWeight: 'bold',
    color: 'darkgreen'
  }

  return (
    <div>
      <h2>books</h2>
      <div>
        Filter by genre:
        <button style={genre === null ? selectedStyle : {}} onClick={genreSelector(null)}>All</button>
        {
          [...genres].map(g => {
            return g === genre
              ? <button key={g} style={selectedStyle} onClick={genreSelector(g)}>{g}</button>
              : <button key={g} onClick={genreSelector(g)}>{g}</button>
          })
        }
      </div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {
            displayBooks.map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            )
            )}
        </tbody>
      </table>
    </div>
  )
}

export default Books
