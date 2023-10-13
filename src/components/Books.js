import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { ALL_BOOKS, ALL_GENRES, DELETE_BOOK } from '../queries'

const Books = () => {
  const [genre, setGenre] = useState(null)
  const genreQuery = useQuery(ALL_GENRES)
  const result = useQuery(ALL_BOOKS, { variables: { genre: genre } })
  const [ deleteBook ] = useMutation(DELETE_BOOK, {
    refetchQueries: [
      { query: ALL_BOOKS, variables: { genre: null } },
      { query: ALL_GENRES },
    ],
    onError: (error) => console.log(error),
  })

  const genreSelector = (genre) => {
    return () => setGenre(genre)
  }

  if (result.loading || genreQuery.loading) {
    return <div>loading books...</div>
  }

  const books = result.data.allBooks
  const genres = genreQuery.data.allGenres

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
          genres.map(g => {
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
            books.map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
                <td>
                  <button onClick={() => deleteBook({ variables: { id: a.id}})}>delete</button>
                </td>
              </tr>
            )
            )}
        </tbody>
      </table>
    </div>
  )
}

export default Books
